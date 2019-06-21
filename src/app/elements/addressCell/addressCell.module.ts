// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { AddressCellComponent } from './addressCell.component';

@NgModule({
  imports: [
    CommonModule,
    NovoElementsModule,
    NovoElementProviders.forChild()
  ],
  declarations: [
    AddressCellComponent
  ],
  entryComponents: [
    AddressCellComponent
  ],
  exports: [
    AddressCellComponent
  ]
})
export class AddressCellModule {}
