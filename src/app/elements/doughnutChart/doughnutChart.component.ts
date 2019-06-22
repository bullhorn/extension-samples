import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ProbabilityScore } from '../../interfaces/examples';

@Component({
  selector: 'app-doughnut-chart',
  styleUrls: ['./doughnutChart.component.scss'],
  template: `
    <canvas baseChart width="256"
            [datasets]="dataSets"
            [options]="options"
            [chartType]="chartType"></canvas>
    <div class="chart-center">
      <div class="percentage">{{probability * 100 | number:'1.0-1'}}%</div>
      <div class="description">{{description}}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutChartComponent implements OnInit {
  @Input() probability: number = new Input();
  @Input() description: string = new Input();

  dataSets: ChartDataSets[] = [{
    data: [0, 1],
    backgroundColor: [
      '#000000',
      '#d9dadc',
    ],
  }];
  options: ChartOptions = {
    // Responsive charts resize themselves, but that rarely works out well. Instead, hardcoding the
    // height and width in pixels in the canvas elements is the best compromise.
    responsive: false,
    circumference: 1.5 * Math.PI,
    rotation: 0.75 * Math.PI,
    cutoutPercentage: 80,
    maintainAspectRatio: true,
    tooltips: {
      enabled: false,
    },
    hover: { mode: null },
    legend: {
      display: false,
    }
  };
  public chartType: ChartType = 'doughnut';

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.update();
  }

  update() {
    this.dataSets[0].data = [this.probability, 1 - this.probability];
    this.dataSets[0].backgroundColor[0] = DoughnutChartComponent.getProbabilityColor(this.probability);
    this.ref.markForCheck();
  }

  /**
   * Returns a score category for the given percentage (0.0 - 1.0)
   */
  private static getProbabilityScore(probability: number): ProbabilityScore {
    if (probability < 0.3) {
      return 'low';
    } else if (probability < 0.7) {
      return 'medium';
    }
    return 'high';
  }

  /**
   * Returns a color code for the category of the given percentage (0.0 - 1.0)
   */
  private static getProbabilityColor(probability: number, lighten = false): string {
    const probabilityColors = {
      low: '#da4453',
      medium: '#f6b042',
      high: '#8cc152',
    };
    const lighterProbabilityColors = {
      low: '#ff4d5e',
      medium: '#ffb80c',
      high: '#a4db54',
    };
    const probabilityScore = this.getProbabilityScore(probability);
    if (lighten) {
      return lighterProbabilityColors[probabilityScore];
    }
    return probabilityColors[probabilityScore];
  }
}
