// Angular
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Vendor
import { AppBridge, IDataTableColumn, NovoToastService } from 'novo-elements';
import { CorporateUser, Placement } from '@bullhorn/bullhorn-types';
import { forkJoin, Observable } from 'rxjs';
// App
import { AppBridgeService } from '../../services';
import { BullhornMeta } from '../../interfaces/bullhorn';
import { Util } from '../../util/util';

@Component({
  selector: 'app-list-action',
  templateUrl: './listAction.component.html',
  styleUrls: ['./listAction.component.scss'],
})
export class ListActionComponent implements OnInit {
  @ViewChildren('table') tables: QueryList<any>;
  rows: any[] = [];
  optedOutPlacements: Placement[] = [];
  missingFieldsPlacements: Placement[] = [];
  corporateUser: CorporateUser;
  authorized = false;
  loading = true;
  sending = false;
  sent = false;
  entityIds: number[];
  private meta: BullhornMeta;
  private placements: Placement[];
  private userId: number;
  private corporationId: number;
  private privateLabelId: number;
  private entityType: string;
  private startMessageTemplate = '';

  constructor(private toaster: NovoToastService,
              private appBridgeService: AppBridgeService,
              private route: ActivatedRoute,
              private httpClient: HttpClient,
              private view: ViewContainerRef,
              private changeDetectorRef: ChangeDetectorRef) {
    this.toaster.parentViewContainer = view;
    this.parseParameters();
  }

  get columns(): IDataTableColumn<any>[] {
    return [{
      id: 'id',
      type: 'number',
    }, {
      id: 'candidateName',
      label: 'Name',
      type: 'text',
      filterable: true,
      sortable: true,
    }, {
      id: 'candidateFirstName',
      label: 'Name',
      type: 'text',
      filterable: true,
      sortable: true,
    }, {
      id: 'companyName',
      label: 'Company',
      type: 'text', enabled: false,
      filterable: true,
      sortable: true,
    }, {
      id: 'originalEndDateTimestamp',
      label: 'Original End Date',
      type: 'text',
      filterable: true,
      sortable: true,
      template: 'timestamp',
    }, {
      id: 'candidatePhone',
      label: 'Phone',
      type: 'link:tel',
      filterable: true,
      sortable: true,
      attributes: {
        target: '_blank',
      },
    }, {
      id: 'message',
      label: 'Message',
      type: 'text',
      filterable: true,
      sortable: true,
      template: 'message',
    }];
  }

  get displayColumns(): string[] {
    return [
      'selection',
      'candidateName',
      'originalEndDateTimestamp',
      'candidatePhone',
      'message',
    ];
  }

  ngOnInit(): void {
    this.appBridgeService.onRegistered.subscribe(this.onRegistered.bind(this));
    this.appBridgeService.registerCustomAction();
  }

  refresh(): void {
    this.appBridgeService.execute((bridge: AppBridge) => {
      bridge.refresh().then((success: any) => {
        console.log('[AppComponent] - Refresh Success!', success);
      });
    });
  }

  close(): void {
    this.appBridgeService.execute((bridge: AppBridge) => {
      bridge.close().then((success: any) => {
        console.log('[AppComponent] - Close Success!', success);
      });
    });
  }

  send() {
    const startFunction = 'https://us-central1-end-date-chatbot.cloudfunctions.net/start';
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    const startCalls: Observable<Object>[] = [];
    this.sending = true;
    this.tables.forEach((table) => {
      table.state.selected.forEach((row) => {
        startCalls.push(this.httpClient.post(startFunction, row, httpOptions));
      });
    });

    forkJoin(startCalls).subscribe((success: any) => {
      this.sending = false;
      this.sent = true;
      console.log('Sent:', success);
      const options: any = {
        message: 'Your message has been sent',
        icon: 'check',
        theme: 'success',
        position: 'fixedTop',
      };
      this.toaster.alert(options).then(() => {
        setTimeout(() => {
          this.close();
        }, 3000);
      });
    }, (error: any) => {
      this.sending = false;
      this.sent = true;
      console.error(error);
      // TODO: Show error on page or in toast
    });
  }

  /**
   * TODO: This is duplicate code of what is in the functions
   */
  instantiateTemplate(templateString: string, data: any): string {
    let instance: string = templateString;
    if (instance && data) {
      for (const propertyName of Object.getOwnPropertyNames(data)) {
        instance = instance.replace(`{{${propertyName}}}`, data[propertyName]);
      }
    }
    return instance;
  }

  // dateEnd,candidate(id,firstName,name,phone,mobile,email,email2,email3,smsOptIn),clientCorporation(id,name)
  getMissingFields(placement: Placement): string[] {
    const missingFields: string[] = [];
    // Placement end date is only required if the welcome text includes it
    if (this.startMessageTemplate.includes('{{originalEndDate}}') && !placement.dateEnd) {
      const field = this.meta.fields.find(f => f.name === 'dateEnd');
      missingFields.push(field.label);
    }
    if (!placement.candidate.phone && !placement.candidate.mobile) {
      missingFields.push('Candidate Phone Number');
    }
    if (!placement.candidate.name) {
      missingFields.push('Candidate Name');
    }
    if (!placement.candidate.firstName) {
      missingFields.push('Candidate First Name');
    }
    if (!placement.clientCorporation.name) {
      missingFields.push('Company Name');
    }
    return missingFields;
  }

  private onRegistered() {
    this.corporateUserLookup().then((corporateUserResponse: { data: CorporateUser }) => {
      const corporateUserData = corporateUserResponse.data;
      this.corporateUser = {
        id: corporateUserData.id,
        name: corporateUserData.name,
        email: Util.convertToString(corporateUserData.email || corporateUserData.email2 || corporateUserData.email3),
        userType: corporateUserData.userType,
      };

      this.placementSearch().then((response: any) => {
        const placementsResponse: Placement[] = response.data;
        this.setupTable(placementsResponse);
        this.loading = false;
      });
    });
  }

  private setupTable(placementsResponse: Placement[]) {
    this.placements = placementsResponse.filter(placement => !this.hasMissingFields(placement));

    // smsOptIn must strictly be false, since a null or undefined value means that the default opt in should be used
    this.optedOutPlacements = placementsResponse.filter(placement => placement.candidate.smsOptIn === false);
    this.missingFieldsPlacements = placementsResponse.filter(placement => this.hasMissingFields(placement))
      .map(p => Object.assign(p, { _subtype: 'Placement' }));

    this.rows = this.placements.map(placement => {
      return {
        id: placement.id,
        corporationId: this.corporationId,
        privateLabelId: this.privateLabelId,
        corporateUserId: this.corporateUser.id,
        corporateUserName: Util.convertToString(this.corporateUser.name),
        corporateUserFirstName: Util.convertToString(this.corporateUser.firstName) ||
          Util.convertToString(this.corporateUser.name).replace(/ .*/, ''),
        corporateUserEmail: Util.convertToString(this.corporateUser.email),
        placementId: placement.id,
        originalEndDate: Util.convertToString(new Date(placement.dateEnd)),
        originalEndDateTimestamp: Util.convertToNumber(placement.dateEnd),
        candidateId: placement.candidate.id,
        candidateName: Util.convertToString(placement.candidate.name),
        candidateFirstName: Util.convertToString(placement.candidate.firstName),
        candidatePhone: Util.convertToString(placement.candidate.phone || placement.candidate.mobile),
        candidateEmail: Util.convertToString(placement.candidate.email || placement.candidate.email2 || placement.candidate.email3),
        candidateOwnerName: Util.convertToString(placement.candidate.owner.name),
        candidateOwnerEmail: Util.convertToString(
          placement.candidate.owner.email || placement.candidate.owner.email2 || placement.candidate.owner.email3),
        companyId: placement.clientCorporation.id,
        companyName: Util.convertToString(placement.clientCorporation.name),
        jobOrderId: placement.jobOrder.id,
        jobOrderTitle: Util.convertToString(placement.jobOrder.title),
      };
    });
    // TODO: Process Meta as well, for displaying field map names
    this.preselectAllRows();
  }

  /**
   * Looks up details about the currently logged in user
   */
  private corporateUserLookup(): Promise<any> {
    return new Promise((resolve) => {
      const fields = 'id,name,firstName,phone,mobile,email,email2,email3,userType';
      this.appBridgeService.execute((appBridge: AppBridge) => {
        appBridge.httpGET(`entity/CorporateUser/${this.userId}?fields=${fields}`).then((response: any) => {
          // TODO: The get method works differently in AppBridge vs. DevAppBridge
          // We need to unwrap the actual Bullhorn Rest response if it's wrapped in a data packet
          if (response.data && response.data.data) {
            response = response.data;
          }
          resolve(response);
        });
      });
    });
  }

  private preselectAllRows(): void {
    setTimeout(() => {
      this.tables.forEach((table) => {
        table.selectRows(true);
      });
      this.changeDetectorRef.markForCheck();
    });
  }

  /**
   * Parses the query string to pull out list action parameters, in the format of:
   * { "EntityType": "Placement", "EntityID": "1149", "UserID": "6", "CorporationID": "14310" "PrivateLabelID": "20885" }
   */
  private parseParameters() {
    this.entityType = this.getStringParameter('EntityType');
    this.entityIds = this.getIdListParameter('EntityID');
    this.userId = this.getIdParameter('UserID');
    this.corporationId = this.getIdParameter('CorporationID');
    this.privateLabelId = this.getIdParameter('PrivateLabelID');
  }

  private getStringParameter(param: string): string {
    return this.route.snapshot.queryParamMap.get(param);
  }

  private getIdParameter(param: string): number {
    return parseInt(this.getStringParameter(param), 10);
  }

  private getIdListParameter(param: string): number[] {
    const idListString = this.getStringParameter(param);
    return idListString ? idListString.split(',').map(idString => parseInt(idString, 10)) : [];
  }

  /**
   * Performs the search needed for getting all of the Placement data and meta
   */
  private placementSearch(): Promise<any> {
    return new Promise((resolve) => {
      const postData: any = {
        query: `(id:${this.entityIds.join(' ')})`,
        fields: 'id,dateEnd,' +
          'candidate(id,firstName,name,phone,mobile,email,email2,email3,smsOptIn,owner(name,email,email2,email3)),' +
          'clientCorporation(id,name),' +
          'jobOrder(id,title)',
        meta: 'full'
      };
      this.appBridgeService.execute((appBridge: AppBridge) => {
        appBridge.httpPOST(`search/${this.entityType}`, postData).then((response: any) => {
          // TODO: The get method works differently in AppBridge vs. DevAppBridge
          // We need to unwrap the actual Bullhorn Rest response if it's wrapped in a data packet
          if (response.data && response.data.data) {
            response = response.data;
          }
          resolve(response);
        });
      });
    });
  }

  private hasMissingFields(placement: Placement): boolean {
    return this.getMissingFields(placement).length > 0;
  }
}
