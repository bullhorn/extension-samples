// NG2
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'todo', loadChildren: './todo-card/todo-card.module#TodoCardModule' }
];

@NgModule({
    imports: [
        // NG2
        RouterModule.forRoot(routes)
    ],
    exports: [
        // NG2
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
