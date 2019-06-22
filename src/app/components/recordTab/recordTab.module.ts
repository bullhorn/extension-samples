// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { EntityCellModule, HtmlCellModule } from '../../elements';
import { AppBridgeService, HttpService } from '../../services';
import { RecordTabComponent } from './recordTab.component';

// All routes lead to our single component for the extension
export const routes: Routes = [
  { path: '**', component: RecordTabComponent, pathMatch: 'full' }
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
  ],
  declarations: [
    // App
    RecordTabComponent,
  ],
  providers: [
    AppBridgeService,
    HttpService,
  ]
})
export class RecordTabModule {}
