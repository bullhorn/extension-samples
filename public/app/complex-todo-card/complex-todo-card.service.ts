import { Injectable } from '@angular/core';
interface ComplexToDo {
    title: string;
    isCompleted: boolean;
    dateBegin: any;
    type: string;
};
@Injectable()
export class ComplexTodoCardService {
    todos: Array<ComplexToDo> = [];
    constructor() {
        this.todos = [{
            title: 'Call Dave about upcoming interview',
            isCompleted: false,
            dateBegin: new Date (),
            type: 'Email'
        }, {
            title: 'Call Jane about upcoming interview',
            isCompleted: false,
            dateBegin: new Date (),
            type: 'Email'
        }];
        this.save();
    }
    getTasks(type: string): any {
        return new Promise(resolve => {
            resolve(this.todos);
        });
    }
    addTodo(todoTitle) {
        // this.todos.push({
        //     title: todoTitle,
        //     done: false
        // });
        // this.save();
    }
    save() {
        localStorage.setItem('complex-todos', JSON.stringify(this.todos));
    }
}
