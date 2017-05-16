// NG2
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Vendor
import { TextBoxControl, FormUtils } from 'novo-elements';


@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
    checklist: Array<any> = [];
    todoControl: TextBoxControl;
    newTodo: String = '';
    todoForm: any;
    layoutOptions: { iconStyle: string };

    constructor(private formUtils: FormUtils,  private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.data.subscribe((data: { list: any }) => {
            this.checklist = data.list;
        });
  }

    addTodo() {
    }
}
