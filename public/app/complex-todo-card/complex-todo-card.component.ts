// NG2
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
// Vendor
import { TextBoxControl, FormUtils } from 'novo-elements';
import { ComplexTodoCardService } from './complex-todo-card.service';

@Component({
  selector: 'complex-todo-card',
  templateUrl: './complex-todo-card.component.html',
  styleUrls: ['./complex-todo-card.component.scss']
})

export class ComplexTodoCardComponent implements OnInit {
    checklist: Array<any> = [];
    todoControl: TextBoxControl;
    newTodo: String = '';
    todoForm: any;
    layoutOptions: { iconStyle: string };
    totalCompleted = 10;
    totalOpen = 5;

    constructor(private service: ComplexTodoCardService, private formUtils: FormUtils) { }

    ngOnInit() {
        this.checklist = this.service.todos;
        this.layoutOptions = { iconStyle: 'circle' };

        this.todoControl = new TextBoxControl({
          key: 'newTodo',
          hidden: false,
          label: "What's on your list?"
        });

        this.todoForm = this.formUtils.toFormGroup([this.todoControl]);
    }

    addTodo(form) {
        this.service.addTodo(form.value['newTodo']);
        form.controls['newTodo'].setValue('');
    }

    openNewTask() {
        this.service.openNewTask();
    }
}
