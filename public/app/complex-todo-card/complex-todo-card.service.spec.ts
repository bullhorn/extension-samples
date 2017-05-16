import { TestBed, inject } from '@angular/core/testing';

import { ComplexTodoCardService } from './complex-todo-card.service';

describe('ComplexTodoCardService', () => {
    let service;
    beforeEach((inject([ComplexTodoCardService], (complexTodoCardService: ComplexTodoCardService) => {
        TestBed.configureTestingModule({
            providers: [ComplexTodoCardService]
        });
        service = complexTodoCardService;
    })));

    describe('Function: Add(todo: any)', () => {
        it('should add todo to the todo list in localStorage', () => {
            service.addToDo('New TODO');
            expect(service.todos.length).toBe(1);
        });
        it('should add todo with title and done', () => {
            const expectedTodo = {
                title: 'New TODO',
                done: false
            };
            service.addToDo('New TODO');
            expect(service.todos[0]).toEqual(expectedTodo);
        });
        it('should add todo with done initialized to false', () => {
            const expectedTodo = {
                title: 'New TODO',
                done: false
            };
            service.addToDo('New TODO');
            expect(service.todos[0].done).toEqual(false);
        });
    });
});
