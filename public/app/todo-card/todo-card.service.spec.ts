import { TestBed, inject } from '@angular/core/testing';
import { NovoElementsModule } from 'novo-elements';

import { TodoCardService } from './todo-card.service';

describe('TodoCardService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TodoCardService]
        });
    });
    beforeEach(inject([TodoCardService], _service => {
        service = _service;
    }));

    describe('Function: Add(todo: any)', () => {
        it('should add todo to the todo list in localStorage', () => {
            service.todos = [];
            service.addTodo('New TODO');
            expect(service.todos.length).toBe(1);
        });
        it('should add todo with title and done', () => {
            service.todos = [];
            const expectedTodo = {
                title: 'New TODO',
                done: false
            };
            service.addTodo('New TODO');
            expect(service.todos[0]).toEqual(expectedTodo);
        });
        it('should add todo with done initialized to false', () => {
            service.todos = [];
            const expectedTodo = {
                title: 'New TODO',
                done: false
            };
            service.addTodo('New TODO');
            expect(service.todos[0].done).toEqual(false);
        });
    });
});
