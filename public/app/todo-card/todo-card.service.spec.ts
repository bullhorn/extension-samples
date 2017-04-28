import { TestBed, inject } from '@angular/core/testing';

import { TodoCardService } from './todo-card.service';

describe('TodoCardService', () => {
    let service;
    beforeEach((inject([TodoCardService], (service: TodoCardService) => {
        TestBed.configureTestingModule({
            providers: [TodoCardService]
        });
    })));

    describe('Function: Add(todo: any)', () => {
        it('should add todo to the todo list in localStorage', () => {
            service.addToDo('New TODO');
            expect(service.todos.length).toBe(1);
        });
        it('should add todo with title and done', () => {
            let expectedTodo = {
                title: 'New TODO',
                done: false
            };
            service.addToDo('New TODO');
            expect(service.todos[0]).toEqual(expectedTodo);
        });
        it('should add todo with done initialized to false', () => {
            let expectedTodo = {
                title: 'New TODO',
                done: false
            };
            service.addToDo('New TODO');
            expect(service.todos[0].done).toEqual(false);
        });
    });
});
