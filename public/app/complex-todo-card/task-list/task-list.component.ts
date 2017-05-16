// NG2
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { TextBoxControl, FormUtils } from 'novo-elements';
//App
import { ComplexTodoCardService } from '../complex-todo-card.service';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
    checklist: Array<any> = [];
    todoControl: TextBoxControl;
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
      this.todoControl = new TextBoxControl({
        key: 'newTodo',
        hidden: false,
        label: "What's on your list?"
      });

      this.todoForm = this.formUtils.toFormGroup([this.todoControl]);
    }
}
