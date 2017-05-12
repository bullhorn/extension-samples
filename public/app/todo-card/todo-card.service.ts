import { Injectable } from '@angular/core';
interface ToDo {
    title: string;
    done: boolean;
};
@Injectable()
export class TodoCardService {
    todos: Array<ToDo> = [];
    constructor() {
        this.todos = [{
            title: 'Call Dave about upcoming interview',
            done: false
        }];
        this.save();
    }
    addTodo(todoTitle) {
        this.todos.push({
            title: todoTitle,
            done: false
        });
        this.save();
    }
    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}
