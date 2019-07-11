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
import { AppBridgeService, HttpService } from './services';
import { RecordTabComponent } from './components/recordTab/recordTab.component';
import { ErrorModalComponent } from './elements/errorModal/errorModal.component';
import { ExtensionOptionsService } from './services/extensionOptions.service';

const routes: Routes = [
  { path: '', redirectTo: 'record-tab', pathMatch: 'full' },
  { path: 'record-tab', component: RecordTabComponent },
];

// Extend the novo elements options service to provide lookup calls in entity pickers
export function optionsFactory(httpService: HttpService): any {
  return new ExtensionOptionsService(httpService);
}

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  declarations: [
    AppComponent,
    RecordTabComponent,
    ErrorModalComponent,
  ],
  providers: [
    AppBridgeService,
    HttpService,
  ],
  entryComponents: [
    ErrorModalComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
