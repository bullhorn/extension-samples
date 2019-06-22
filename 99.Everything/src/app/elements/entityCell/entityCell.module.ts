// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { EntityCellComponent } from './entityCell.component';

@NgModule({
  imports: [
    CommonModule,
    NovoElementsModule,
    NovoElementProviders.forChild()
  ],
  declarations: [
    EntityCellComponent
  ],
  entryComponents: [
    EntityCellComponent
  ],
  exports: [
    EntityCellComponent
  ]
})
export class EntityCellModule {}
