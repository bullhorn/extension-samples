// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { ErrorModalComponent } from './errorModal.component';

@NgModule({
  imports: [
    CommonModule,
    NovoElementsModule,
    NovoElementProviders.forChild()
  ],
  declarations: [
    ErrorModalComponent
  ],
  entryComponents: [
    ErrorModalComponent
  ],
  exports: [
    ErrorModalComponent
  ]
})
export class ErrorModalModule {}
