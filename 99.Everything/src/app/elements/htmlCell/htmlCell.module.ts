// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { HtmlCellComponent } from './htmlCell.component';

@NgModule({
  imports: [
    CommonModule,
    NovoElementsModule,
    NovoElementProviders.forChild()
  ],
  declarations: [
    HtmlCellComponent
  ],
  entryComponents: [
    HtmlCellComponent
  ],
  exports: [
    HtmlCellComponent
  ]
})
export class HtmlCellModule {}
