// NG
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
// Vendor
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { EntityTypes, JobOrder } from '@bullhorn/bullhorn-types';
// App
import { AppBridgeService } from '../../services';
import { HistoricJobCategory } from '../../interfaces/examples';
import { Util } from '../../util/util';

@Component({
  selector: 'app-scatter-plot',
  template: `
    <canvas baseChart width="880"
            [datasets]="dataSets"
            [options]="options"
            [colors]="colors"
            [legend]="legend"
            [labels]="labels"
            [chartType]="chartType"
            [plugins]="plugins"></canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScatterPlotComponent implements OnInit {
  @Input() historicJobs: HistoricJobCategory = new Input();
  @Input() currentJob: JobOrder = new Input();
  @Input() placementProbability: number = new Input();

  public dataSets: ChartDataSets[] = [
    { data: [], label: 'Placements', pointRadius: 4, pointHoverRadius: 6, borderWidth: 1 },
    { data: [], label: 'Top Placements', pointRadius: 4, pointHoverRadius: 6, borderWidth: 1 },
    { data: [], label: 'Current Job', pointRadius: 8, pointHoverRadius: 10, borderWidth: 1 },
  ];
  public colors: Color[] = [{
    backgroundColor: 'rgba(128,128,128,0.4)',
    borderColor: 'rgba(128,128,128,0.8)',
    pointBackgroundColor: 'rgba(128,128,128,0.8)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(128,128,128,0.8)',
  }, {
    backgroundColor: 'rgba(140,193,82,0.2)',
    borderColor: 'rgba(140,193,82,1)',
    pointBackgroundColor: 'rgba(140,193,82,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: 'rgba(140,193,82,1)',
    pointHoverBorderColor: 'rgba(140,193,82,0.8)'
  }, {
    backgroundColor: 'rgba(187,85,102,0.2)',
    borderColor: 'rgba(187,85,102,1)',
    pointBackgroundColor: 'rgba(187,85,102,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: 'rgba(187,85,102,1)',
    pointHoverBorderColor: 'rgba(187,85,102,0.8)'
  }];
  public legend = true;
  public labels: Label[] = [];
  public chartType: ChartType = 'scatter';
  public plugins: any = [pluginAnnotations];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  private topJobs: { id, title, x, y }[] = [];
  private remainingJobs: { id, title, x, y }[] = [];
  public options: ChartOptions = {
    // Responsive charts resize themselves, but that rarely works out well. Instead, hardcoding the
    // height and width in pixels in the canvas elements is the best compromise.
    responsive: false,
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          max: 1,
          callback: (value) => {
            return (value * 100).toFixed(0) + '%';
          },
        },
        scaleLabel: {
          display: true,
          labelString: 'Fill Score',
        },
      }],
      yAxes: [{
        ticks: {
          min: 0,
          callback: (value) => Util.formatCurrency(value)
        },
        scaleLabel: {
          display: true,
          labelString: 'Hourly Bill Rate',
        },
      }]
    },
    tooltips: {
      callbacks: {
        title: (items) => {
          const score: number = <number>items[0].xLabel;
          const percentage: string = (score * 100).toFixed(1) + '%';
          const billRate: string = Util.formatCurrency(items[0].yLabel);
          if (items[0].datasetIndex === 0) {
            const jobTitle = this.remainingJobs[items[0].index].title;
            return `${jobTitle} - Bill Rate: ${billRate} / Score: ${percentage}`;
          } else if (items[0].datasetIndex === 1) {
            const jobTitle = this.topJobs[items[0].index].title;
            return `${jobTitle} - Bill Rate: ${billRate} / Score: ${percentage}`;
          }
          return `${this.currentJob.title} - Bill Rate: ${items[0].yLabel} / Score: ${percentage}`;
        },
        label: (tooltipItem, data) => {
          return data.datasets[tooltipItem.datasetIndex].label || '';
        }
      }
    },
    // Make the cursor a pointer when over chart elements like points
    onHover: (event: any, chartElement: any[]) => {
      event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
    },
    // Clicking on a job will open that job record
    onClick: (event: any, chartElements: any[]) => {
      if (chartElements && chartElements.length) {
        let jobId: number;
        const chartElement = chartElements[0];
        if (chartElement._datasetIndex === 0) {
          jobId = this.remainingJobs[chartElement._index].id;
        } else if (chartElement._datasetIndex === 1) {
          jobId = this.topJobs[chartElement._index].id;
        }
        if (jobId) {
          console.log('jobId:', jobId);
          this.appBridgeService.execute(bridge => bridge.open({ entityId: `${jobId}`, entityType: EntityTypes.JobOrder, type: 'record' }));
        }
      }
    },
    legend: {
      // Make the cursor a pointer when over the legend
      onHover: (event: any) => {
        event.target.style.cursor = 'pointer';
      },
    },
  };

  constructor(private appBridgeService: AppBridgeService,
              private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.update();
  }

  update() {
    // All jobs with scores
    const data: { id, title, x, y }[] = this.historicJobs.jobs.map(job => {
      const daysToFillPercentage = Util.demoizeDaysToFillPercentage(job.daysToFirstFill, this.historicJobs.averages.daysToFirstFill);
      const fillScore = (job.submitToFillRate + daysToFillPercentage) / 2;
      return { id: job.id, title: job.title, x: fillScore, y: job.billRate };
    });

    // Take top 50% bill rate sorted by score, then top 25% of that
    const medianBillRate = Util.average(data.map(job => job.y));
    const topBillRate = data.filter(job => job.y > medianBillRate).sort((a, b) => b.x - a.x);
    this.topJobs = topBillRate.slice(0, topBillRate.length / 2);

    const topJobIds: number[] = this.topJobs.map(job => job.id);
    this.remainingJobs = data.filter(job => !topJobIds.includes(job.id));

    this.dataSets[0].data = this.remainingJobs;
    this.dataSets[1].data = this.topJobs;
    this.dataSets[2].data = [{
      x: this.placementProbability,
      y: Util.demoizeBillRate(this.currentJob.clientBillRate, this.historicJobs.averages.billRate),
    }];
    this.dataSets[2].label = this.currentJob.title.toString();

    this.ref.markForCheck();
  }
}
