import { Injectable, EventEmitter } from '@angular/core';
// Vendor
import { PagedArrayCollection, AppBridge } from 'novo-elements';
import { ReplaySubject } from 'rxjs/ReplaySubject';
// APP
import { MOCK_TODOS } from './mock-todo';
interface ComplexToDo {
    subject:string;
    isCompleted:boolean;
    dateBegin:any;
    type:string;
    dueText?:string;
    dueType?:string;
}
@Injectable()
export class ComplexTodoCardService {
    todos:Array<ComplexToDo> = [];
    onNewTask:EventEmitter<{ event:any }> = new EventEmitter<{ event:any }>();

    constructor(private bridge:AppBridge) {
    }

    openNewTask() {
        this.onNewTask.emit();
    }

    saveTodo(todo):any {
        todo.dateBegin = new Date(todo.dateBegin).getTime();
        todo.dateAdded = new Date().getTime();
        return this.bridge
            .httpPUT(`/entity/Task`, JSON.stringify(todo));

    }

    openTask(data) {
        this.bridge.open({
            type: 'record',
            entityType: 'Task',
            entityId: data.id
        });
    }

    getTasks(type:string):any {
        const isCompleted = type === 'open' ? 0 : 1;
        return new Promise(resolve => {
            const fields = ['id', 'subject', 'type', 'isCompleted', 'dateBegin'].join();
            const query = `isDeleted:0 AND isCompleted:${isCompleted}`;
            this.bridge
                .httpGET(`/search/Task?fields=${fields}&count=20&query=${query}&sort=dateBegin,-dateAdded`)
                .then(response => {
                    if (response && response.data && response.data.count) {
                        this.todos = response.data.data.map(item => {
                            const now = new Date();
                            const diff = this.getTimeDifference(item.dateBegin);
                            if (item.dateBegin < now) {
                                item.dueText = `Due ${diff.number} ${diff.type} ago`;
                                item.dueType = 'past';
                            } else {
                                item.dueText = `Due in ${diff.number} ${diff.type}`;
                                item.dueType = 'future';
                                if (diff.type.includes('hour')) {
                                    item.dueType = 'soon';
                                }
                            }
                            return item;
                        });
                        resolve(this.todos);
                    } else {
                        resolve([]);
                    }
                })
                .catch(err => {
                    resolve(this.todos);
                    console.error('error', err);
                });
        });
    }

    getTimeDifference(dateValue:number):any {
        const diff = Math.abs(dateValue - new Date().getTime());
        let result:any = {};
        if (Math.ceil(diff / 3600000) < 24) {
            result.number = Math.ceil(diff / 3600);
            if (result.number === 1) {
                result.type = 'hour';
            } else {
                result.type = 'hours';
            }
        } else if (diff / (24 * 3600000) < 30) {
            result.number = Math.floor(diff / (24 * 3600));
            if (result.number === 1) {
                result.type = 'day';
            } else {
                result.type = 'days';
            }
        } else {
            result.number = Math.floor(diff / (24 * 3600000 * 30));
            if (result.number === 1) {
                result.type = 'month';
            } else {
                result.type = 'months';
            }
        }
        return result;
    }
}
