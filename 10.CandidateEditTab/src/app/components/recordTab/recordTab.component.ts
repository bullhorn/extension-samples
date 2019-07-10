// Angular
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { FormUtils, NovoModalService, NovoToastService } from 'novo-elements';
import { Candidate, EntityTypes, JobOrder } from '@bullhorn/bullhorn-types';
// App
import { AppBridgeService, HttpService } from '../../services';
import { BullhornMeta, JobOrderResponse, NovoFieldset } from '../../interfaces/bullhorn';
import { CreateModalComponent } from '../../elements/createModal/createModal.component';
import { ErrorModalComponent } from '../../elements/errorModal/errorModal.component';
import { Util } from '../../util/util';

@Component({
  selector: 'app-record-tab',
  templateUrl: './recordTab.component.html',
  styleUrls: ['./recordTab.component.scss'],
})
export class RecordTabComponent implements OnInit {
  loading = true;
  connected = true;
  hasErrors = false;
  saving = false;
  errorMessage: string;
  errorDetails: string;
  candidate: Candidate;
  candidateMeta: BullhornMeta;
  candidateFields: string[] = ['id', 'name', 'occupation', 'status', 'isDeleted', 'description'];
  jobOrderFields: string[] = ['id', 'title', 'description'];
  jobOrder: JobOrder;
  jobOrderMeta: BullhornMeta;
  form: any;
  fieldSets: NovoFieldset[];
  isNovoEnabled = false;
  private readonly corpId: number;
  private readonly privateLabelId: number;
  private readonly userId: number;
  private readonly entityId: number;
  private readonly entityType: string;

  constructor(private appBridgeService: AppBridgeService,
              private toaster: NovoToastService,
              private modalService: NovoModalService,
              private httpService: HttpService,
              private formUtils: FormUtils,
              private route: ActivatedRoute,
              private view: ViewContainerRef) {
    this.toaster.parentViewContainer = view; // This is to tell the toaster which view to display on top of
    this.modalService.parentViewContainer = view; // This is to tell the modal which view to display on top of

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

  async save() {
    this.saving = true;
    const successToast: any = {
      message: 'This is a successful toast! The window is closing now...',
      icon: 'check',
      theme: 'success',
      position: 'fixedTop',
    };

    const missingFieldsToast: any = {
      message: 'There are required fields that are missing',
      icon: 'caution',
      theme: 'warning',
      position: 'fixedTop',
    };

    this.hasErrors = !this.form.valid;
    if (this.hasErrors) {
      this.saving = false;
      this.showOnlyRequired();
      const toast: any = await this.toaster.alert(missingFieldsToast).then(() => {
        setTimeout(() => {
          toast.close();
        }, 3000);
      });
    } else {
      const toast: any = await this.toaster.alert(successToast).then(() => {
        setTimeout(() => {
          toast.close();
        }, 3000);
      });
    }
  }

  async cancel() {
    console.log('I am here in the cancel() method!');
  }

  private showAllFields(): any {
    this.hasErrors = false;
    this.fieldSets.forEach((fieldSet) => {
      fieldSet.controls.forEach((control) => {
        control.hidden = false;
      });
    });
  }

  private showOnlyRequired(): any {
    this.fieldSets.forEach((fieldSet) => {
      fieldSet.controls.forEach((control) => {
        // Hide any non-required fields without errors
        control.hidden = !control.required && !control.errors;
      });
    });
  }

  private async onRegistered(isRegistered) {
    if (isRegistered) {
      this.connected = true;
      // Style the page like novo, using the 90% zoom-out to match the app
      this.isNovoEnabled = await this.appBridgeService.isNovoEnabled();
      document.body.className = this.isNovoEnabled ? 'novo' : 's-release';
      await this.process();
    } else {
      this.connected = false;
      this.loading = false;
    }
  }

  private async process() {
    try {
      // Get data for the current job
      const jobOrderResponse: JobOrderResponse = await this.httpService.getEntity(
        EntityTypes.JobOrder, this.entityId, this.jobOrderFields.join(), 'basic');
      this.jobOrder = jobOrderResponse.data;
      this.jobOrderMeta = jobOrderResponse.meta;
      this.loading = false;

      // Get the candidate from the create modal
      this.candidate = await this.modalService.open(CreateModalComponent, { jobOrder: this.jobOrder }).onClosed;

      // Get data for the selected candidate and VMS submittal form
      const responses: any[] = await Promise.all([
        this.httpService.getEntity(EntityTypes.Candidate, this.candidate.id, this.candidateFields.join(), 'basic'),
      ]);
      this.candidate = responses[0].data;
      this.candidateMeta = responses[0].meta;

      // Construct the form
      this.fieldSets = this.formUtils.toFieldSets(this.candidateMeta, '$ USD', {}, { token: 'TOKEN' });
      this.form = this.formUtils.toFormGroupFromFieldset(this.fieldSets);
      this.showAllFields();
    } catch (err) {
      this.errorMessage = 'Cannot get record data from Bullhorn';
      this.errorDetails = err ? err.message : `Error communicating via App Bridge`;
      this.loading = false;
      return;
    }
  }

  private showExampleErrorModal() {
    const data = {
      error: 'Cannot Submit this Candidate',
      details: 'You have reached the maximum number of submissions for this job.'
    };
    this.modalService.open(ErrorModalComponent, data).onClosed.then(() => {
      console.log('Error Modal Closed');
    });
  }

  /**
   * Helper method to get query string parameter arguments from Bullhorn
   */
  private getBullhornId(param: string): number {
    return parseInt(this.route.snapshot.queryParamMap.get(param), 10);
  }
}
