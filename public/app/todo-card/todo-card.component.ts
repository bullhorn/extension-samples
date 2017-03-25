// NG2
import { Component, OnInit } from '@angular/core';
//Vendor
import { TextBoxControl, FormUtils } from 'novo-elements';
import { TodoCardService } from './todo-card.service';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss']
})
export class TodoCardComponent implements OnInit {
  checklist: Array<any> = [];
  todoControl: TextBoxControl;
  newTodo: String = '';
  todoForm: any;

  constructor(private service: TodoCardService, private formUtils: FormUtils) { }

  ngOnInit() {
    this.checklist = this.service.todos;

    this.todoControl = new TextBoxControl({
      key: 'newTodo',
      hidden: false,
      label: 'What do you need to do?'
    });

    this.todoForm = this.formUtils.toFormGroup([this.todoControl]);
  }

  addTodo(form) {
    this.service.addTodo(form.value['newTodo']);
    form.controls['newTodo'].setValue('');
  }
}
