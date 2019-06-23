// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
// App
import { AppBridgeService, HttpService } from '../../services';
import { Util } from '../../util/util';

@Component({
  selector: 'app-record-card',
  templateUrl: './recordCard.component.html',
  styleUrls: ['./recordCard.component.scss'],
})
export class RecordCardComponent implements OnInit {
  loading = true;
  connected = true;
  isNovoEnabled = false;
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
    Util.setHtmlExtensionClass('custom-card');
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
}
