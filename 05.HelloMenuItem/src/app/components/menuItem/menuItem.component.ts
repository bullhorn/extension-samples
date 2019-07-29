// Angular
import { Component, OnInit } from '@angular/core';
// Vendor
import { AppBridge } from 'novo-elements';
// App
import { AppBridgeService, HttpService } from '../../services';
import { Util } from '../../util/util';
import { UserSettings } from '../../interfaces/bullhorn';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menuItem.component.html',
  styleUrls: ['./menuItem.component.scss'],
})
export class MenuItemComponent implements OnInit {
  loading = true;
  connected = true;
  isNovoEnabled = false;
  private corpId: number;
  private privateLabelId: number;
  private userId: number;

  constructor(private appBridgeService: AppBridgeService,
              private httpService: HttpService) {
    Util.setHtmlExtensionClass('custom-menu-item');
  }

  ngOnInit(): void {
    if (this.connected) {
      this.appBridgeService.onRegistered.subscribe(this.onRegistered.bind(this));
      this.appBridgeService.registerCustomMenuItem();
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
      const userSettings: UserSettings = await this.httpService.getSettings('corporationId,privateLabelId,userId,novoEnabled');
      this.userId = userSettings.userId;
      this.privateLabelId = userSettings.privateLabelId.id;
      this.corpId = userSettings.corporationId;
      this.connected = !!this.userId && !!this.corpId && !!this.privateLabelId;
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
}
