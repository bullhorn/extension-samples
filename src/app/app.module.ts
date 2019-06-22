// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
// Vendor
// App
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', redirectTo: 'record-tab', pathMatch: 'full' },
  { path: 'card-comparison', loadChildren: './components/cardComparison/cardComparison.module#CardComparisonModule' },
  { path: 'card-forecast', loadChildren: './components/cardForecast/cardForecast.module#CardForecastModule' },
  { path: 'card-potential', loadChildren: './components/cardPotential/cardPotential.module#CardPotentialModule' },
  { path: 'list-action', loadChildren: './components/listAction/listAction.module#ListActionModule' },
  { path: 'record-action', loadChildren: './components/recordAction/recordAction.module#RecordActionModule' },
  { path: 'record-tab', loadChildren: './components/recordTab/recordTab.module#RecordTabModule' },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
