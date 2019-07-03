// NG
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { AppComponent } from './app.component';
import { RecordTabComponent } from './components/recordTab/recordTab.component';
import { AppBridgeService, HttpService } from './services';

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
    FormsModule,
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  declarations: [
    AppComponent,
    RecordTabComponent,
  ],
  providers: [
    AppBridgeService,
    HttpService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
