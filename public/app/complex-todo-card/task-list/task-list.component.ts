// NG2
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { TextBoxControl, SelectControl, DateTimeControl, FormUtils } from 'novo-elements';
// App
import { ComplexTodoCardService } from '../complex-todo-card.service';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
    checklist: Array<any> = [];
    subjectControl: TextBoxControl;
    typeControl: SelectControl;
    dueDateControl: DateTimeControl;
    newTodo: String = '';
    todoForm: any;
    layoutOptions: { iconStyle: string };
    addingNewTask: boolean = false;
    taskSubscription: any;

    constructor(private formUtils: FormUtils,  private route: ActivatedRoute, private service: ComplexTodoCardService) { }

    ngOnInit() {
        this.layoutOptions = { iconStyle: 'circle' };
        this.route.data.subscribe((data: { list: any }) => {
            this.checklist = data.list;
        });
        this.taskSubscription = this.service.onNewTask.subscribe(() => { this.displayNewTask()});
        this.initializeForm();
  }

  ngOnDestroy() {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

    addTodo() {
    }

    displayNewTask() {
      this.addingNewTask = true;
    }

    initializeForm() {
      this.subjectControl = new TextBoxControl({
          key: 'subject',
          hidden: false,
          placeholder: 'What\'s on your list?'
      });
      this.typeControl = new SelectControl({
          key: 'type',
          options: [{
            label: 'Email',
            value: 'Email'
          }, {
            label: 'Call',
            value: 'Call'
          }]
      });
      this.dueDateControl = new DateTimeControl({
        key: 'dateBegin',
      });
      this.todoForm = this.formUtils.toFormGroup([this.subjectControl, this.typeControl, this.dueDateControl]);
    }
}
