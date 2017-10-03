// NG2
import { NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Http, HttpModule } from '@angular/http';
// Vendor
import { NovoElementsModule, NovoElementProviders, AppBridge, DevAppBridge } from 'novo-elements';
// APP
import { ComplexTodoCardComponent } from './complex-todo-card.component';
import { ComplexTodoCardService } from './complex-todo-card.service';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskListResolverService } from './task-list/task-list-resolver.service';
import { environment } from '../../environments/environment';

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

let bridge: AppBridge;
export function appBridgeFactory(http: Http): AppBridge {
    if (!bridge) {
        if ( environment.production ) {
            bridge = new AppBridge('ComplexToDoCard');
        } else {
            bridge = new DevAppBridge('ComplexToDoCard', http);
        }
        bridge.register();
        bridge.tracing = true;
    }
    return bridge;
}

@NgModule({
    imports: [
        // NG2
        HttpModule,
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
            useFactory:  appBridgeFactory,
            deps: [ Http ]
        }
    ]
})
export class ComplexTodoCardModule {
}
