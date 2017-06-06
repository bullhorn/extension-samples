// NG2
import { ElementRef, ViewContainerRef, ApplicationRef, Injectable, ChangeDetectorRef } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
// Vendor
import { Observable } from 'rxjs/Observable';
import { AppBridge, FormUtils, NovoModalService, NovoToastService, NovoDragulaService, NovoModalParams, NovoModalRef, ComponentUtils, NovoLabelService } from 'novo-elements';
// APP

import { TodoCardService } from './app/todo-card/todo-card.service';
import { ComplexTodoCardService } from './app/complex-todo-card/complex-todo-card.service';
import { AppComponent } from './app/app.component';
import { TodoCardComponent } from './app/todo-card/todo-card.component';
import { ComplexTodoCardComponent } from './app/complex-todo-card/complex-todo-card.component';
import { TaskListComponent } from './app/complex-todo-card/task-list/task-list.component';

let MOCK_SERVICE_DATA = null;

class MockActivatedRoute {
    snapshot: any = {
        queryParams: {
            criteria: 'TEST',
            section: 'test'
        },
        url: [
            {
                path: 'urlPath'
            }
        ],
        params: {
            id: 1561
        }
    };
}

class MockRouter {
    parent: any = {};
    navigate = () => {
    }
}

class MockViewContainerRef {
}

class MockApplicationRef {
}

class MockElementRef {
    nativeElement: any = {
        querySelectorAll: () => {
            return [];
        }
    };
}

class MockLocationService {
    public replaceState(path: string, query: string = ''): void {

    }
}

export const COMPONENTS = [
    AppComponent,
    TodoCardComponent,
    ComplexTodoCardComponent,
    TaskListComponent
];

export const SERVICES = [
    TodoCardService,
    ComplexTodoCardService
];

export const TEST_HTTP_PROVIDERS = [
    BaseRequestOptions,
    MockBackend,
    {
        provide: Http,
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
    }
];

export const TEST_SERVICE_PROVIDERS = [
    // NG2 Overrides
    { provide: ActivatedRoute, useClass: MockActivatedRoute },
    { provide: Router, useClass: MockRouter },
    { provide: ElementRef, useClass: MockElementRef },
    { provide: ViewContainerRef, useClass: MockViewContainerRef },
    { provide: ApplicationRef, useClass: MockApplicationRef },
    { provide: Location, useClass: MockLocationService },
    // Vendor Overrides
    FormUtils,
    // Vendor
    { provide: ChangeDetectorRef, useClass: ChangeDetectorRef },
    {
        provide: AppBridge,
        useFactory: () => new AppBridge('testAppBridge'),
    }
    // APP
    ...COMPONENTS,
    ...SERVICES
];

export const TEST_PROVIDERS = [
    ...TEST_HTTP_PROVIDERS,
    ...TEST_SERVICE_PROVIDERS
];
