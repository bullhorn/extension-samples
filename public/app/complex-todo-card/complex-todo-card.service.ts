import { Injectable } from '@angular/core';
import { PagedArrayCollection, AppBridge } from 'novo-elements';
// APP
import { MOCK_TODOS } from './mock-todo';

interface ComplexToDo {
    subject: string;
    isCompleted: boolean;
    dateBegin: any;
    type: string;
};
@Injectable()
export class ComplexTodoCardService {
    todos: Array<ComplexToDo> = [];
    bridge: AppBridge = new AppBridge('TaskList');
    constructor() {
        this.bridge.register();
        this.todos = MOCK_TODOS;
        this.save();
    }
    getTasks(type: string): any {
        const isCompleted = type === 'open' ? 0 : 1;
        return new Promise(resolve => {
            const fields = ['id', 'subject', 'type', 'isCompleted', 'dateBegin'].join();
            const query = `isDeleted:0 AND isCompleted:${isCompleted}`;
            console.log(`/search/Task?fields=${fields}&count=20&query=${query}&sort=dateBegin,-dateAdded`);
            this.bridge
                .httpGET(`/search/Task?fields=${fields}&count=20&query=${query}&sort=dateBegin,-dateAdded`)
                .then( response => {
                    console.log('response', response);
                    resolve(response);
                })
                .catch(err => {
                    resolve(this.todos);
                    console.error('error', err);
                });
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
