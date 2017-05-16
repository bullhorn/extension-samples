// NG2
import { Injectable } from '@angular/core';
import { Router, Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
// VENDOR
import { Observable } from 'rxjs/Observable';
// APP
import { ComplexTodoCardService } from './../complex-todo-card.service';
@Injectable()
export class TaskListResolverService {

    constructor(private router: Router, private service: ComplexTodoCardService) {
    }

    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        const { type } = route.params;
        return this.service.getTasks(type);
    }
}
