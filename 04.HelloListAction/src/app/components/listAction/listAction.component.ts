// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { AppBridge } from 'novo-elements';
// App
import { AppBridgeService, HttpService } from '../../services';
import { Util } from '../../util/util';

@Component({
  selector: 'app-list-action',
  templateUrl: './listAction.component.html',
  styleUrls: ['./listAction.component.scss'],
})
export class ListActionComponent implements OnInit {
  loading = true;
  connected = true;
  isNovoEnabled = false;
  private readonly corpId: number;
  private readonly privateLabelId: number;
  private readonly userId: number;
  private readonly entityIds: number[];
  private readonly entityType: string;

  constructor(private appBridgeService: AppBridgeService,
              private httpService: HttpService,
              private route: ActivatedRoute) {
    // Get query string parameters passed over from Bullhorn
    this.entityType = this.route.snapshot.queryParamMap.get('EntityType');
    this.entityIds = this.getBullhornIdList('EntityID');
    this.userId = this.getBullhornId('UserID');
    this.corpId = this.getBullhornId('CorporationID');
    this.privateLabelId = this.getBullhornId('PrivateLabelID');
    this.connected = !!this.entityIds && !!this.userId && !!this.corpId && !!this.privateLabelId;
    Util.setHtmlExtensionClass('custom-action');
  }

  ngOnInit(): void {
    if (this.connected) {
      this.appBridgeService.onRegistered.subscribe(this.onRegistered.bind(this));
      this.appBridgeService.registerCustomAction();
    }
  }

  close(): void {
    this.appBridgeService.execute((bridge: AppBridge) => {
      bridge.close().then((success: any) => {
        console.log('[AppComponent] - Close Success!', success);
      });
    });
  }

  private async onRegistered(isRegistered) {
    if (isRegistered) {
      this.connected = true;
      this.isNovoEnabled = await this.appBridgeService.isNovoEnabled();
      if (this.isNovoEnabled) {
        document.body.className = 'zoom-out';
      }
      this.loading = false;
    } else {
      this.connected = false;
      this.loading = false;
    }
  }

  private getBullhornId(param: string): number {
    return parseInt(this.route.snapshot.queryParamMap.get(param), 10);
  }

  private getBullhornIdList(param: string): number[] {
    const idListString = this.route.snapshot.queryParamMap.get(param);
    return idListString ? idListString.split(',').map(idString => parseInt(idString, 10)) : [];
  }
}
