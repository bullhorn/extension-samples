// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// APP
import { ListActionComponent } from './listAction.component';
import { AppBridgeService } from '../../services';

export const routes: Routes = [
  { path: '', component: ListActionComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    // NG
    CommonModule,
    RouterModule.forChild(routes),
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  declarations: [
    ListActionComponent,
  ],
  providers: [AppBridgeService],
})
export class ListActionModule {}
