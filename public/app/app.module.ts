// NG2
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// APP
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NovoElementsModule } from 'novo-elements';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        // NG2
        BrowserModule,
        FormsModule,
        HttpModule,
        // APP
        AppRoutingModule,
        SharedModule,
        NovoElementsModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
