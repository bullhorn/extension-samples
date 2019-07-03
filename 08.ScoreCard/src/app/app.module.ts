// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
import { ChartsModule } from 'ng2-charts';
// App
import { AppComponent } from './app.component';
import { RecordCardComponent } from './components/recordCard/recordCard.component';
import { AppBridgeService, HttpService } from './services';
import { EntityCellComponent } from './elements/entityCell/entityCell.component';
import { DoughnutChartComponent } from './elements/doughnutChart/doughnutChart.component';
import { HistoricJobsComponent } from './elements/historicJobs/historicJobs.component';

const routes: Routes = [
  { path: '', redirectTo: 'record-card', pathMatch: 'full' },
  { path: 'record-card', component: RecordCardComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule.forRoot(routes),
    ChartsModule,
    FormsModule,
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  declarations: [
    AppComponent,
    RecordCardComponent,
    DoughnutChartComponent,
    HistoricJobsComponent,
    EntityCellComponent,
  ],
  providers: [
    AppBridgeService,
    HttpService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
