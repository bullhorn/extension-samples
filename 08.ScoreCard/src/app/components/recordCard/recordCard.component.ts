// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { EntityTypes, JobOrder } from '@bullhorn/bullhorn-types';
import * as Chart from 'chart.js';
// App
import { AppBridgeService, HttpService } from '../../services';
import { Util } from '../../util/util';
import { BullhornMeta, JobOrderResponse } from '../../interfaces/bullhorn';
import { Averages, HistoricJobCategory, JobCategory, ProbabilityScore, ProbabilityScoreInput } from '../../interfaces/examples';
import { DoughnutChartComponent } from '../../elements/doughnutChart/doughnutChart.component';
import { HistoricJobsComponent } from '../../elements/historicJobs/historicJobs.component';

@Component({
  selector: 'app-record-card',
  templateUrl: './recordCard.component.html',
  styleUrls: ['./recordCard.component.scss'],
})
export class RecordCardComponent implements OnInit {
  // Current job data
  currentJob: JobOrder;
  jobMeta: BullhornMeta;
  jobFields: string[] = ['id', 'clientCorporation', 'title', 'dateAdded', 'startDate', 'dateClosed', 'numOpenings',
    'address(state)', 'submissions[10](dateAdded)', 'placements[10](dateAdded)'];
  creationDate: Date;
  startDate: Date;
  daysOpen: number;
  daysUntilStartDate: number;
  useStartDate: boolean;
  numSubmissions: number;
  numOpenings: number;

  // Projected job data
  projectedStartDate: Date;
  projectedFillDate: Date;
  daysSpent: number;
  daysRemaining: number;
  probabilityToClose: number;
  probabilityScore: ProbabilityScore = 'high';

  // Historic job data
  historicJobCategories: HistoricJobCategory[];
  averages: Averages;

  // Extension data
  loading = true;
  connected = true;
  errorMessage: string;
  errorDetails: string;
  isNovoEnabled = false;
  showDetails = false;
  @ViewChild(DoughnutChartComponent) doughnutChartComponent: DoughnutChartComponent;
  @ViewChild(HistoricJobsComponent) historicJobsComponent: HistoricJobsComponent;
  private readonly corpId: number;
  private readonly privateLabelId: number;
  private readonly userId: number;
  private readonly entityId: number;

  constructor(private appBridgeService: AppBridgeService,
              private httpService: HttpService,
              private route: ActivatedRoute) {
    // Get query string parameters passed over from Bullhorn
    this.entityId = this.getBullhornId('EntityID');
    this.userId = this.getBullhornId('UserID');
    this.corpId = this.getBullhornId('CorporationID');
    this.privateLabelId = this.getBullhornId('PrivateLabelID');
    this.connected = !!this.entityId && !!this.userId && !!this.corpId && !!this.privateLabelId;
    Util.setHtmlExtensionClass('custom-card');
    Chart.defaults.global.defaultFontSize = 11;
  }

  ngOnInit(): void {
    if (this.connected) {
      this.appBridgeService.onRegistered.subscribe(this.onRegistered.bind(this));
      this.appBridgeService.register();
    }
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
    this.update();
  }

  update(): void {
    this.computeProbabilityScore();
    setTimeout(() => {
      if (this.doughnutChartComponent) {
        this.doughnutChartComponent.update();
      }
      if (this.historicJobsComponent) {
        this.historicJobsComponent.update();
      }
    }, 50);
  }

  private async onRegistered(isRegistered) {
    if (isRegistered) {
      this.connected = true;
      this.getCurrentJobData();
      this.isNovoEnabled = await this.appBridgeService.isNovoEnabled();
      if (this.isNovoEnabled) {
        document.body.className = 'zoom-out';
      }
    } else {
      this.connected = false;
      this.loading = false;
    }
  }

  /**
   * Gets details about the current job order.
   */
  private getCurrentJobData() {
    this.httpService.getEntity(EntityTypes.JobOrder, this.entityId, this.jobFields.join(), 'basic').then((response: any) => {
      const jobOrderResponse: JobOrderResponse = response;
      this.currentJob = jobOrderResponse.data;
      this.jobMeta = jobOrderResponse.meta;

      // Pull significant fields into individual member variables
      this.creationDate = new Date(Util.convertToNumber(this.currentJob.dateAdded));
      this.startDate = new Date(Util.convertToNumber(this.currentJob.startDate));
      this.numSubmissions = response.data.submissions.total;
      this.numOpenings = Math.min(jobOrderResponse.data.numOpenings, 1);
      this.getAllHistoricJobData();

    }).catch(this.handleError.bind(this));
  }

  /**
   * Job Search Calls - pull historic data for drawing conclusions about placement probability.
   *
   * To calculate placement rate, we make an extra call just for the count of all valid job orders without placements.
   *
   * Calls:
   *  0. Company total jobs count
   *  1. Company jobs with submissions (for count only)
   *  2. Company jobs with placements (for count only)
   *  3. Related role total jobs count
   *  4. Related role jobs with submissions (for count only)
   *  5. Related role jobs with placements (for count only)
   */
  private getAllHistoricJobData(): void {
    // Create search strings
    const notDeleted = `isDeleted:false`;
    const withSubmission = `submissions.id:[0 TO 99999999999]`;
    const withPlacement = `placements.id:[0 TO 99999999999]`;
    const companySearch = `clientCorporation.id:${this.currentJob.clientCorporation.id} AND ${notDeleted}`;
    const companySearchWithSubmission = `${companySearch} AND ${withSubmission}`;
    const companySearchWithPlacement = `${companySearch} AND ${withPlacement}`;

    // For now, instead of looking up all related jobs, just make this a simple search that looks for jobs in the same state
    const roleSearch = `address.state:${this.currentJob.address.state} AND ${notDeleted}`;
    const roleSearchWithSubmission = `${roleSearch} AND ${withSubmission}`;
    const roleSearchWithPlacement = `${roleSearch} AND ${withPlacement}`;

    // Construct calls
    const calls: Promise<any>[] = [];
    calls.push(this.httpService.search(EntityTypes.JobOrder, companySearch, 'id', 'off', 1));
    calls.push(this.httpService.search(EntityTypes.JobOrder, companySearchWithSubmission, 'id', 'off', 1));
    calls.push(this.httpService.search(EntityTypes.JobOrder, companySearchWithPlacement, this.jobFields.join(), 'off', 400));
    calls.push(this.httpService.search(EntityTypes.JobOrder, roleSearch, 'id', 'off', 1));
    calls.push(this.httpService.search(EntityTypes.JobOrder, roleSearchWithSubmission, 'id', 'off', 1));
    calls.push(this.httpService.search(EntityTypes.JobOrder, roleSearchWithPlacement, this.jobFields.join(), 'off', 400));

    // Process the job data received
    Promise.all(calls).then((responses: any[]) => {
      this.historicJobCategories = [
        Util.createHistoricJobsAndAverages(responses[0].total, responses[1].total, responses[2].total, responses[2].data),
        Util.createHistoricJobsAndAverages(responses[3].total, responses[4].total, responses[5].total, responses[5].data),
      ];
      this.averages = Util.computeAverages(this.historicJobCategories);
      this.computeProbabilityScore();
      this.loading = false;
    }).catch(this.handleError.bind(this));
  }

  /**
   * Calculate this job's important dates and date ranges, based on creation/start/average days to fill
   */
  private calculateDatesAndRanges() {
    this.daysOpen = Util.daysSince(this.creationDate.getTime());
    this.daysUntilStartDate = Util.daysUntil(this.startDate.getTime());
    const daysBetweenDateAddedAndStartDate = Util.daysBetween(this.creationDate.getTime(), this.startDate.getTime());

    // Use days until the start date (if sufficiently large enough), or days since creation date
    if (daysBetweenDateAddedAndStartDate > 5 && this.daysUntilStartDate > 0) {
      this.useStartDate = true;
      this.projectedStartDate = Util.subtractDays(this.startDate, this.averages.daysToFirstFill);
      this.projectedFillDate = this.startDate;
    } else {
      this.useStartDate = false;
      this.projectedStartDate = this.creationDate;
      this.projectedFillDate = Util.addDays(this.creationDate, this.averages.daysToFirstFill);
    }
    this.daysSpent = Util.daysSince(this.projectedStartDate.getTime());
    this.daysRemaining = Util.daysUntil(this.projectedFillDate.getTime());
  }

  /**
   * Post Processing of all related jobs to calculate averages after the results are in.
   */
  private computeProbabilityScore(): void {
    this.calculateDatesAndRanges();
    const input: ProbabilityScoreInput = {
      numSubmissions: this.numSubmissions,
      daysRemaining: this.daysRemaining,
      numOpenings: this.numOpenings,
    };
    this.probabilityToClose = Util.computeProbabilityScore(input, this.averages).probabilityToClose;
    this.probabilityScore = Util.getProbabilityScore(this.daysSpent, this.averages);
    this.printDebuggingInfo();
  }

  /**
   * Print debugging information in the console
   */
  private printDebuggingInfo() {
    const averagesTable: any = {
      'Company': Util.roundForPrinting(this.historicJobCategories[JobCategory.Company].averages),
      'Regional': Util.roundForPrinting(this.historicJobCategories[JobCategory.Role].averages),
    };
    averagesTable.Average = Util.roundForPrinting(this.averages);
    console.table(averagesTable);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const calculationsTable: any = {
      daysOpen: this.daysOpen,
      projectedStartDate: this.projectedStartDate.toLocaleDateString('en-US', options),
      projectedFillDate: this.projectedFillDate.toLocaleDateString('en-US', options),
      daysSpent: this.daysSpent,
      daysRemaining: this.daysRemaining,
      numOpenings: this.numOpenings,
      numSubmissions: this.numSubmissions,
      placementPotential: Util.roundToPrecision(this.probabilityToClose, 3),
    };
    if (this.daysUntilStartDate > 0) {
      calculationsTable.daysUntilStartDate = this.daysUntilStartDate;
    }
    console.table(calculationsTable);
  }

  private handleError(err: Error) {
    this.errorMessage = 'Cannot get record data from Bullhorn.';
    this.errorDetails = err ? err.message : `Error communicating via App Bridge`;
    this.loading = false;
  }

  private getBullhornId(param: string): number {
    return parseInt(this.route.snapshot.queryParamMap.get(param), 10);
  }
}
