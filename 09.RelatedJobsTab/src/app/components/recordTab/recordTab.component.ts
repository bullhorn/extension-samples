// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { IDataTableColumn, IDataTablePaginationOptions } from 'novo-elements';
import { EntityTypes, JobOrder } from '@bullhorn/bullhorn-types';
// App
import { AppBridgeService, HttpService } from '../../services';
import { BullhornMeta, JobOrderResponse } from '../../interfaces/bullhorn';
import { Util } from '../../util/util';

@Component({
  selector: 'app-record-tab',
  templateUrl: './recordTab.component.html',
  styleUrls: ['./recordTab.component.scss'],
})
export class RecordTabComponent implements OnInit {
  loading = true;
  connected = true;
  errorMessage: string;
  errorDetails: string;
  isNovoEnabled = false;

  currentJob: JobOrder;
  jobMeta: BullhornMeta;
  jobs: any[];
  jobFields: string[] = ['id', 'title', 'publicDescription', 'address(state)', 'isDeleted', 'status', 'submissions[1](dateAdded,candidate)'];

  columns: IDataTableColumn<any>[];
  displayColumns: string[] = ['title', 'score', 'candidate', 'status'];
  defaultSort = { id: 'score', value: 'desc' };
  paginationOptions: IDataTablePaginationOptions = {
    theme: 'standard',
    page: 0,
    pageSize: 25,
    pageSizeOptions: [25, 50, 100, 250, 500],
  };

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
    Util.setHtmlExtensionClass('custom-tab');
  }

  ngOnInit(): void {
    if (this.connected) {
      this.appBridgeService.onRegistered.subscribe(this.onRegistered.bind(this));
      this.appBridgeService.register();
    }
  }

  private async onRegistered(isRegistered) {
    if (isRegistered) {
      this.connected = true;
      this.getCurrentAndRelatedJobs();
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
   * Gets details about related jobs for displaying in the list.
   */
  private getCurrentAndRelatedJobs() {
    this.httpService.getEntity(EntityTypes.JobOrder, this.entityId, this.jobFields.join(), 'basic').then(async (response: any) => {
      const jobOrderResponse: JobOrderResponse = response;
      this.currentJob = jobOrderResponse.data;
      this.jobMeta = jobOrderResponse.meta;
      this.getRelatedJobs();
    }).catch(this.handleError.bind(this));
  }

  /**
   * Get related jobs (here in this example, that means jobs in the same state as the current one)
   */
  private getRelatedJobs() {
    this.jobs = [];
    const notDeleted = `isDeleted:false`;
    const regionalSearch = `${notDeleted}`;
    this.httpService.search(EntityTypes.JobOrder, regionalSearch, this.jobFields.join(), 'basic', 50).then((response: any) => {
      this.postProcessJobData(response);
      this.buildColumns();
      this.loading = false;
    }).catch(this.handleError.bind(this));
  }

  private postProcessJobData(jobs: JobOrder[]): void {
    this.jobs = jobs;
    this.jobs = this.jobs.filter((job) => {
      if (job.isDeleted || job.status === 'Archive') {
        // tslint:disable-next-line:no-console
        console.debug('Filtered out Job:', job.title, 'isDeleted:', job.isDeleted, 'status:', job.status);
      }
      return !job.isDeleted && job.status !== 'Archive';
    });

    this.jobs.forEach(job => {
      // Add a random score value
      job.score = Math.random();

      // Pull the most recent submission's candidate from the submission array up into the candidate's data
      if (job.submissions && job.submissions.data && job.submissions.data.length > 0) {
        job.candidate = job.submissions.data[0].candidate;
      }
    });

    // Must match `this.defaultSort` - jobs by score descending.
    this.jobs.sort((a, b) => b.score - a.score);
  }

  private buildColumns() {
    this.columns = [{
      id: 'id',
      type: 'number',
    }, {
      id: 'title',
      label: 'Title',
      type: 'text',
      template: 'jobOrder',
    }, {
      id: 'score',
      label: 'Score',
      type: 'text',
      template: 'percentage',
      width: 120,
    }, {
      id: 'status',
      label: 'Status',
      type: 'text',
      width: 200,
    }, {
      id: 'candidate',
      label: 'Previous Submission',
      type: 'text',
      template: 'candidate',
      width: 260,
    }];
    this.columns.forEach(column => {
      const columnMeta: any = this.jobMeta.fields.find((item) => item.name === column.id);
      column.label = columnMeta ? columnMeta.label : column.label;
      column.filterable = true;
      column.sortable = true;
    });
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
