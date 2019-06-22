// Angular
import { Component, OnInit } from '@angular/core';
// Vendor
import { FormUtils, NovoModalParams, NovoModalRef } from 'novo-elements';
import { Candidate, JobOrder } from '@bullhorn/bullhorn-types';
// App
import { BullhornMeta } from '../../interfaces/bullhorn';

@Component({
  selector: 'app-create-modal',
  styleUrls: ['./createModal.component.scss'],
  template: `
    <novo-modal id="create-modal">
      <header title="Create VMS Submittal" theme="submission" icon="star-o">
        <utils>
          <util-action icon="times" (click)="close()"></util-action>
        </utils>
      </header>
      <section>
        <novo-dynamic-form [fieldsets]="fieldSets" [(form)]="form"></novo-dynamic-form>
      </section>
      <button theme="standard" (click)="close()">Cancel</button>
      <button theme="primary" color="action" icon="check" (click)="save()" [disabled]="!form.valid">Create</button>
    </novo-modal>
  `,
})
export class CreateModalComponent implements OnInit {
  jobOrder: JobOrder;
  form: any;
  fieldSets: any[];

  constructor(private formUtils: FormUtils,
              private modalRef: NovoModalRef,
              private params: NovoModalParams) {
  }

  ngOnInit() {
    this.jobOrder = this.params['jobOrder'];
    this.setupForm();
  }

  close() {
    this.modalRef.close();
  }

  save() {
    this.modalRef.close(this.form.value.candidate);
  }

  private setupForm() {
    const meta: BullhornMeta = {
      fields: [{
        name: 'jobOrder',
        type: 'text',
        label: 'Job',
        required: true,
        disabled: true,
        sortOrder: 1,
        defaultValue: this.jobOrder.title,
      }, {
        name: 'candidate',
        type: 'TO_ONE',
        label: 'Candidate',
        optionsType: 'Candidate',
        optionsUrl: 'lookup',
        required: true,
        sortOrder: 2,
        associatedEntity: {
          entity: 'Candidate',
        },
      }],
    };

    this.fieldSets = this.formUtils.toFieldSets(meta, '$ USD', {}, { token: 'TOKEN' });
    this.form = this.formUtils.toFormGroupFromFieldset(this.fieldSets);
  }
}
