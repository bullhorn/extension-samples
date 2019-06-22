// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { CreateModalComponent, EntityCellModule, ErrorModalModule, HtmlCellModule } from '../../elements';
import { AppBridgeService, HttpService } from '../../services';
import { RecordActionComponent } from './recordAction.component';

// All routes lead to our single component for the extension
export const routes: Routes = [
  { path: '**', component: RecordActionComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    // NG
    CommonModule,
    RouterModule.forChild(routes),
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
    // App
    EntityCellModule,
    HtmlCellModule,
    ErrorModalModule,
  ],
  declarations: [
    // App
    RecordActionComponent,
    CreateModalComponent,
  ],
  providers: [
    AppBridgeService,
    HttpService,
  ]
})
export class RecordActionModule {}
