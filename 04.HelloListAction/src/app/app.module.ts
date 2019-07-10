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
import { ListActionComponent } from './components/listAction/listAction.component';
import { AppBridgeService, HttpService } from './services';

const routes: Routes = [
  { path: '', redirectTo: 'list-action', pathMatch: 'full' },
  { path: 'list-action', component: ListActionComponent },
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
    ListActionComponent,
  ],
  providers: [
    AppBridgeService,
    HttpService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
