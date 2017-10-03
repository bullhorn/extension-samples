// NG2
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'todo', loadChildren: './todo-card/todo-card.module#TodoCardModule' },
    { path: 'complex-todo', loadChildren: './complex-todo-card/complex-todo-card.module#ComplexTodoCardModule' }
];

@NgModule({
    imports: [
        // NG2
        RouterModule.forRoot(routes),
        BrowserAnimationsModule
    ],
    exports: [
        // NG2
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
