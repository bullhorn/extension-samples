// NG
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
// Vendor
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
// App
import { HistoricJobCategory, JobCategory } from '../../interfaces/examples';
import { Util } from '../../util/util';

@Component({
  selector: 'app-histogram',
  template: `
    <canvas baseChart width="790"
            [datasets]="dataSets"
            [options]="options"
            [colors]="colors"
            [legend]="legend"
            [chartType]="chartType"
            [plugins]="plugins"></canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistogramComponent implements OnInit {
  @Input() historicJobs: HistoricJobCategory = new Input();
  @Input() daysSpent: number = new Input();
  @Input() category: JobCategory = new Input();

  public dataSets: ChartDataSets[] = [
    {
      data: [],
      label: 'Successful Submits',
      yAxisID: 'counts',
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 2,
      borderWidth: 1
    },
    { data: [], label: 'Placements', yAxisID: 'counts', pointRadius: 4, pointHoverRadius: 6, pointHoverBorderWidth: 2, borderWidth: 1 },
    { data: [], label: 'New Revenue', yAxisID: 'dollars', pointRadius: 4, pointHoverRadius: 6, pointHoverBorderWidth: 2, borderWidth: 1 }
  ];
  public options: (ChartOptions & { annotation: any }) = {
    // Responsive charts resize themselves, but that rarely works out well. Instead, hardcoding the
    // height and width in pixels in the canvas elements is the best compromise.
    // Get rid of zero and zeros in the currency labels

    responsive: false,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'week',
        },
        ticks: {
          callback: (dateString: string) => {
            const dateOptions = { day: 'numeric', month: 'short' };
            return new Date(dateString).toLocaleDateString('en-US', dateOptions);
          },
        },
      }],
      yAxes: [{
        id: 'counts',
        ticks: {
          min: 0.01,
          beginAtZero: false,
          callback: function (value) {
            if (value === '0.01' || value === 0.01) {
              return '';
            }
            return value;
          }
        },
        scaleLabel: {
          display: true,
        },
      }, {
        id: 'dollars',
        position: 'right',
        gridLines: {
          display: false,
        },
        ticks: {
          min: 0.01,
          beginAtZero: false,
          callback: (value) => {
            if (value > 10) {
              return Util.formatCurrency(value);
            }
          }
        }
      }]
    },
    tooltips: {
      callbacks: {
        title: (items) => {
          const dateOptions = { day: 'numeric', month: 'short' };
          const date: Date = new Date(items[0].xLabel);
          const dateString: string = date.toLocaleDateString('en-US', dateOptions);
          const submitLabel = items[0].yLabel === 1 ? 'submit' : 'submits';
          const placementLabel = items[0].yLabel === 1 ? 'placement' : 'placements';
          const currency: string = items[0].yLabel.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

          // Get the day number for the point
          const todaysDate: Date = new Date();
          const startDate: Date = Util.subtractDays(todaysDate, this.daysSpent);
          const dayNumber: number = Util.daysBetween(startDate.getTime(), date.getTime());

          if (items[0].datasetIndex === 0) {
            return `${items[0].yLabel} successful ${submitLabel} on day ${dayNumber} (${dateString})`;
          } else if (items[0].datasetIndex === 1) {
            return `${items[0].yLabel} ${placementLabel} on day ${dayNumber} (${dateString})`;
          }
          return `${currency} - average first paycheck on day ${dayNumber} (${dateString})`;
        },
        label: (tooltipItem, data) => {
          return data.datasets[tooltipItem.datasetIndex].label || '';
        }
      }
    },
    annotation: {
      events: ['click', 'mousemove'],
      annotations: [{}, {}, {}],
    },
    // Make the cursor a pointer when over chart elements like points
    onHover: (event: any, chartElement: any[]) => {
      event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
    },
    legend: {
      // Make the cursor a pointer when over the legend
      onHover: (event: any) => {
        event.target.style.cursor = 'pointer';
      }
    },
  };
  public colors: Color[] = [{
    backgroundColor: 'rgba(128,128,128,0.4)',
    borderColor: 'rgba(128,128,128,1)',
    pointBackgroundColor: 'rgba(128,128,128,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(128,128,128,0.8)',
  }];
  public legend = true;
  public chartType: ChartType = 'line';
  public plugins: any = [pluginAnnotations];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  private showProjectedDates = false;

  constructor(private ref: ChangeDetectorRef) { }

  // Adjust the label to the right/left of the line at the given point between zero and the end of the chart
  private static getXAdjust(point: number, end: number): number {
    const moveFactor = end * 0.05;
    if (point <= moveFactor) {
      return 25;
    } else if (end - point <= moveFactor) {
      return -25;
    }
    return 0;
  }

  private static getYMax(daysToSubmitData: number[], daysToFillData: number[]) {
    const yMax = Util.roundToNearest(Math.max(...daysToSubmitData, ...daysToFillData), 5);
    return yMax === 15 ? 16 : yMax;
  }

  private static convertHistogramToDateChart(histogram: number[], startDate: Date): { x: Date, y: number }[] {
    return histogram.map((num, index) => {
      return { x: Util.addDays(startDate, index), y: num };
    });
  }

  ngOnInit() {
    this.update();
  }

  update() {
    const probabilityColor: string = Util.getProbabilityColor(this.daysSpent, this.historicJobs.averages);
    const numDays: number = Math.round(this.historicJobs.averages.daysToFirstFill * 2 + 30);
    const todayAnnotationValue: number = Math.max(0, Math.round(Math.min(this.daysSpent, numDays - 1)));
    const avgSubmitValue = Math.round(this.historicJobs.averages.daysToFirstSuccessfulSubmit);
    const todaysDate: Date = new Date();
    const startDate: Date = Util.subtractDays(todaysDate, todayAnnotationValue);
    const projectedSubmitDay: number = Math.round(this.historicJobs.averages.daysToFirstFill + this.daysSpent);
    const projectedPayDay: number = projectedSubmitDay + 30;

    // Days to submit data
    const daysToSubmitArray: number[] = this.historicJobs.jobs.map(job => job.daysToFirstSuccessfulSubmit);
    const daysToSubmitData: number[] = Util.calculateHistogram(daysToSubmitArray, numDays);
    this.dataSets[0].data = HistogramComponent.convertHistogramToDateChart(daysToSubmitData, startDate);

    // Days to fill data
    const daysToFillArray: number[] = this.historicJobs.jobs.map(job => job.daysToFirstFill);
    const daysToFillData: number[] = Util.calculateHistogram(daysToFillArray, numDays);
    this.dataSets[1].data = HistogramComponent.convertHistogramToDateChart(daysToFillData, startDate);

    // Bill rate data
    const billRateData: number[] = Util.calculateBillRateHistogram(this.historicJobs.jobs, numDays);
    this.dataSets[2].data = HistogramComponent.convertHistogramToDateChart(billRateData, startDate);

    // Days to submit green zone
    const greenZoneAnnotation: any = {
      type: 'box',
      xScaleID: 'x-axis-0',
      yScaleID: 'y-axis-0',
      xMin: startDate,
      xMax: Util.addDays(startDate, avgSubmitValue),
      yMin: 0,
      yMax: HistogramComponent.getYMax(daysToSubmitData, daysToFillData),
      backgroundColor: 'rgba(140,193,82,0.2)',
      drawTime: 'beforeDatasetsDraw',
    };

    // Days to submit yellow zone
    const yellowZoneAnnotation: any = {
      type: 'box',
      xScaleID: 'x-axis-0',
      yScaleID: 'y-axis-0',
      xMin: Util.addDays(startDate, avgSubmitValue),
      xMax: Util.addDays(startDate, avgSubmitValue * 3),
      yMin: 0,
      yMax: HistogramComponent.getYMax(daysToSubmitData, daysToFillData),
      backgroundColor: 'rgba(246,176,66,0.2)',
      drawTime: 'beforeDatasetsDraw',
    };

    // Today annotation line
    const todayAnnotation: any = {
      type: 'line',
      mode: 'vertical',
      scaleID: 'x-axis-0',
      borderColor: this.daysSpent > numDays ? null : probabilityColor,
      borderWidth: 4,
      value: Util.addDays(startDate, todayAnnotationValue),
      label: {
        enabled: true,
        fontColor: probabilityColor,
        position: 'center',
        content: this.daysSpent > numDays ? 'Today -->' : 'Today',
        xAdjust: HistogramComponent.getXAdjust(this.daysSpent, numDays),
      },
      drawTime: 'afterDatasetsDraw',
      onClick: () => {
        this.showProjectedDates = !this.showProjectedDates;
        this.update();
      },
      onMouseover: () => {
        const chartInstance: any = this.chart.chart;
        if (chartInstance) {
          chartInstance.canvas.style.cursor = 'pointer';
          chartInstance.update();
        }
      },
    };

    // Projected fill
    const estimatedFillAnnotation: any = {
      type: 'line',
      mode: 'vertical',
      scaleID: 'x-axis-0',
      borderColor: 'rgba(51,153,221,1)',
      borderWidth: 4,
      value: Util.addDays(startDate, projectedSubmitDay),
      label: {
        enabled: true,
        fontColor: 'rgb(61,177,255)',
        position: 'center',
        content: 'Est. Fill',
      },
      drawTime: 'afterDatasetsDraw',
    };

    // Projected payday
    const estimatedPayAnnotation: any = {
      type: 'line',
      mode: 'vertical',
      scaleID: 'x-axis-0',
      borderColor: 'rgba(255,205,87,1)',
      borderWidth: 4,
      value: Util.addDays(startDate, projectedPayDay),
      label: {
        enabled: true,
        fontColor: 'rgba(255,205,87,1)',
        position: 'center',
        content: 'Est. Pay',
      },
      drawTime: 'afterDatasetsDraw',
    };

    // There is a bug in the annotation framework where the line will not redraw unless it is reassigned.
    Object.assign(this.options.annotation.annotations, [greenZoneAnnotation, yellowZoneAnnotation, todayAnnotation]);
    const chart: any = this.chart.chart;
    if (chart) {
      chart.options.annotation.annotations = [greenZoneAnnotation, yellowZoneAnnotation, todayAnnotation];
      if (this.showProjectedDates) {
        chart.options.annotation.annotations.push(estimatedFillAnnotation, estimatedPayAnnotation);
      }
      chart.update();
    }

    this.ref.markForCheck();
  }
}
