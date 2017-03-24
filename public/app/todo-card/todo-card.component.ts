// NG2
import { Component, OnInit } from '@angular/core';
//Vendor
import { TextBoxControl  } from 'novo-elements';
import { TodoCardService } from './todo-card.service';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss']
})
export class TodoCardComponent implements OnInit {
  checklist: Array<any> = [];
  constructor(private service: TodoCardService) { }

  ngOnInit() {
    this.checklist = this.service.todos;

  }
}
