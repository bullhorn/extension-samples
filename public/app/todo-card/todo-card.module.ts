// NG2
import { NgModule, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
//Vendor
import { NovoElementsModule, NovoElementProviders } from 'novo-elements';
// APP
import { TodoCardComponent } from './todo-card.component';
import { TodoCardService } from './todo-card.service';

export const routes: Routes = [
  { path: '', component: TodoCardComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    // NG2
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),

    //Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot()
  ],
  declarations: [
    TodoCardComponent
  ],
  providers: [
    TodoCardService
  ]
})
export class TodoCardModule {
 }
