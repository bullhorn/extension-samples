// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { EntityTypes, JobOrder } from '@bullhorn/bullhorn-types';
import * as Chart from 'chart.js';
// App
import { AppBridgeService, HttpService } from '../../services';
import { Util } from '../../util/util';
import { StateUtil } from '../../util/stateUtil';
import { HistogramComponent, HistoricJobsComponent } from '../../elements';
import { BullhornMeta, JobOrderResponse } from '../../interfaces/bullhorn';
import { Averages, HistoricJobCategory, JobCategory, ProbabilityScore, ProbabilityScoreInput } from '../../interfaces/examples';

@Component({
  selector: 'app-card-forecast',
  templateUrl: './cardForecast.component.html',
  styleUrls: ['./cardForecast.component.scss'],
})
export class CardForecastComponent implements OnInit {
  // Current job data
  currentJob: JobOrder;
  jobMeta: BullhornMeta;
  jobFields: string[] = ['id', 'clientCorporation', 'title', 'dateAdded', 'startDate', 'dateClosed', 'numOpenings', 'clientBillRate',
    'address(state)', 'submissions[10](dateAdded,jobOrder(id))', 'placements[10](dateAdded,jobOrder(id))'];
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
  dataSetOptions: { label: string, value: number }[] = [
    { label: 'COMPANY', value: JobCategory.Company },
    { label: 'ROLE', value: JobCategory.Role },
  ];
  loadedDataSet: number = JobCategory.Company;

  // Extension data
  loading = true;
  connected = true;
  errorMessage: string;
  errorDetails: string;
  isNovoEnabled = false;
  showDetails = false;
  @ViewChild(HistogramComponent) histogramComponent: HistogramComponent;
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

  switchDataset() {
    this.update();
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
    this.update();
  }

  update(): void {
    this.computeProbabilityScore();
    setTimeout(() => {
      if (this.histogramComponent) {
        this.histogramComponent.update();
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
    Promise.all([
      this.httpService.getEntity(EntityTypes.JobOrder, this.entityId, this.jobFields.join(), 'basic')
    ]).then((responses: any[]) => {
      const jobOrderResponse: JobOrderResponse = responses[0];
      this.currentJob = jobOrderResponse.data;
      this.jobMeta = jobOrderResponse.meta;

      // Pull significant fields into individual member variables for adjusting dynamically using the demo
      this.creationDate = new Date(Util.convertToNumber(this.currentJob.dateAdded));
      this.startDate = new Date(Util.convertToNumber(this.currentJob.startDate));
      this.numSubmissions = responses[0].data.submissions.total;
      this.numOpenings = Math.min(jobOrderResponse.data.numOpenings, 1);

      this.dataSetOptions[0].label = this.currentJob.clientCorporation.name.toString();
      this.dataSetOptions[1].label = this.currentJob.title.toString();

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
   *  1. Company jobs with submissions
   *  2. Company jobs with placements
   *  3. Regional total jobs count
   *  4. Regional jobs with submissions
   *  5. Regional jobs with placements
   */
  private getAllHistoricJobData(): void {
    // Create search strings
    const notDeleted = `isDeleted:false`;
    const withSubmission = `submissions.id:[0 TO 99999999999]`;
    const withPlacement = `placements.id:[0 TO 99999999999]`;
    const companySearch = `clientCorporation.id:${this.currentJob.clientCorporation.id} AND ${notDeleted}`;
    const companySearchWithSubmission = `${companySearch} AND ${withSubmission}`;
    const companySearchWithPlacement = `${companySearch} AND ${withPlacement}`;
    const roleSearch = `${StateUtil.getStateSearchString(this.currentJob.address.state)} AND ${notDeleted}`;
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
