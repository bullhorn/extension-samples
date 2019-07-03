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
import { RecordTabComponent } from './components/recordTab/recordTab.component';
import { AppBridgeService, HttpService } from './services';
import { EntityCellComponent } from './elements/entityCell/entityCell.component';
import { HtmlCellComponent } from './elements/htmlCell/htmlCell.component';

const routes: Routes = [
  { path: '', redirectTo: 'record-tab', pathMatch: 'full' },
  { path: 'record-tab', component: RecordTabComponent },
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
    RecordTabComponent,
    EntityCellComponent,
    HtmlCellComponent,
  ],
  providers: [
    AppBridgeService,
    HttpService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
