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
  { path: '', redirectTo: 'related-candidates', pathMatch: 'full' },
  { path: 'related-candidates', loadChildren: './components/relatedCandidates/relatedCandidates.module#RelatedCandidatesModule' },
  { path: 'related-jobs', loadChildren: './components/relatedJobs/relatedJobs.module#RelatedJobsModule' },
  { path: 'pipeline-forecast', loadChildren: './components/pipelineForecast/pipelineForecast.module#PipelineForecastModule' },
  { path: 'strike-zone', loadChildren: './components/strikeZone/strikeZone.module#StrikeZoneModule' },
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
