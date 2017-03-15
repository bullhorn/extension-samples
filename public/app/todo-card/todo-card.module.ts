// NG2
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// APP
import { TodoCardComponent } from './todo-card.component';

export const routes: Routes = [
  { path: '', component: TodoCardComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    // NG2
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TodoCardComponent
  ]
})
export class TodoCardModule { }
