// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
import { ChartsModule } from 'ng2-charts';
// App
import { CardComparisonComponent } from './cardComparison.component';
import { EntityCellModule, ScatterPlotComponent } from '../../elements';
import { AppBridgeService, HttpService } from '../../services';

// All routes lead to our single component for the extension
export const routes: Routes = [
  { path: '**', component: CardComparisonComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    // NG
    CommonModule,
    RouterModule.forChild(routes),
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
    FormsModule,
    ChartsModule,
    // App
    EntityCellModule,
  ],
  declarations: [
    // App
    CardComparisonComponent,
    ScatterPlotComponent,
  ],
  providers: [
    AppBridgeService,
    HttpService,
  ]
})
export class CardComparisonModule {}
