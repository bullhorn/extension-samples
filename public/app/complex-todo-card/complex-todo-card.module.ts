// NG2
import { NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// Vendor
import { NovoElementsModule, NovoElementProviders, AppBridge } from 'novo-elements';
// APP
import { ComplexTodoCardComponent } from './complex-todo-card.component';
import { ComplexTodoCardService } from './complex-todo-card.service';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskListResolverService } from './task-list/task-list-resolver.service';

const bridge: AppBridge = new AppBridge('ComplexToDoCard');
bridge.register();
bridge.tracing = true;

export const routes: Routes = [
    {
        path: '',
        component: ComplexTodoCardComponent,
        children: [
            { path: 'list/:type', component: TaskListComponent, resolve: { list: TaskListResolverService } },
            {
                path: '',
                redirectTo: 'list/open',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [
        // NG2
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        // Vendor
        NovoElementsModule,
        NovoElementProviders.forRoot()
    ],
    declarations: [
        ComplexTodoCardComponent,
        TaskListComponent
    ],
    providers: [
        ComplexTodoCardService,
        TaskListResolverService,
        {
            provide: AppBridge,
            useValue: bridge
        }
    ]
})
export class ComplexTodoCardModule {
}
