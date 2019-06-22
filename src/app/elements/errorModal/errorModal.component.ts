import { Component, OnInit } from '@angular/core';
import { NovoModalParams, NovoModalRef } from 'novo-elements';

@Component({
  selector: 'app-error-modal',
  styleUrls: ['./errorModal.component.scss'],
  template: `
    <novo-notification type="warning">
      <h1>{{ error }}</h1>
      <h2>{{ details }}</h2>
      <button theme="standard" (click)="close()">Close</button>
    </novo-notification>
  `,
})
export class ErrorModalComponent implements OnInit {
  error = '';
  details = '';

  constructor(public modalRef: NovoModalRef,
              public params: NovoModalParams) {}

  public ngOnInit(): void {
    this.error = this.params['error'];
    this.details = this.params['details'];
  }

  public close(): void {
    this.modalRef.close();
  }
}
