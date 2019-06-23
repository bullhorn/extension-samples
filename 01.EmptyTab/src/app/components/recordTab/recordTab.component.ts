// Angular
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { IDataTableColumn, IDataTablePaginationOptions } from 'novo-elements';
// App
import { AppBridgeService, HttpService } from '../../services';
import { Util } from '../../util/util';

@Component({
  selector: 'app-record-tab',
  templateUrl: './recordTab.component.html',
  styleUrls: ['./recordTab.component.scss'],
})
export class RecordTabComponent implements OnInit {
  @ViewChildren('table') tables: QueryList<any>;
  loading = true;
  connected = true;
  errorMessage: string;
  errorDetails: string;
  jobs: any[];
  jobOrderMeta: { fields: any[] };
  columns: IDataTableColumn<any>[];
  displayColumns: string[] = ['expand', 'title', 'score', 'candidate', 'status'];
  jobFields: string[] = ['id', 'title', 'publicDescription', 'isDeleted', 'status', 'submissions[1](dateAdded,candidate)'];
  defaultSort = { id: 'score', value: 'desc' };
  isNovoEnabled = false;
  publicDescriptionLabel = 'Public Description';
  processedTitle = '';
  processedDescription = '';
  showProcessedData = false;
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
  private readonly entityType: string;

  constructor(private appBridgeService: AppBridgeService,
              private httpService: HttpService,
              private route: ActivatedRoute) {
    // Get query string parameters passed over from Bullhorn
    this.entityType = this.route.snapshot.queryParamMap.get('EntityType');
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
      // this.getMatchingJobs();
      this.isNovoEnabled = await this.appBridgeService.isNovoEnabled();
      if (this.isNovoEnabled) {
        document.body.className = 'zoom-out';
      }
    } else {
      this.connected = false;
      this.loading = false;
    }
  }

  private getBullhornId(param: string): number {
    return parseInt(this.route.snapshot.queryParamMap.get(param), 10);
  }
}
