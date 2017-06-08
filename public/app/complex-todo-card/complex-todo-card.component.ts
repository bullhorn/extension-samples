// NG2
import { Component, EventEmitter, Output } from '@angular/core';
// Vendor
import { ComplexTodoCardService } from './complex-todo-card.service';

@Component({
  selector: 'complex-todo-card',
  templateUrl: './complex-todo-card.component.html',
  styleUrls: ['./complex-todo-card.component.scss']
})

export class ComplexTodoCardComponent {

    // TODO - these numbers should be real
    totalCompleted = 10;
    totalOpen = 5;

    constructor(private service: ComplexTodoCardService) {
     }

    openNewTask() {
        this.service.openNewTask();
    }
}
