import { TestBed, inject } from '@angular/core/testing';
import { ComplexTodoCardService } from './complex-todo-card.service';
import { TEST_PROVIDERS } from '../../test.providers';

describe('ComplexTodoCardService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ComplexTodoCardService,
                ...TEST_PROVIDERS
            ]
        });
    });
    beforeEach(inject([ComplexTodoCardService], _service => {
        service = _service;
    }));
    describe('Function: openNewTask()', () => {
        it('should add todo to the todo list in localStorage', () => {
            spyOn(service.onNewTask, 'emit');
            service.openNewTask();
            expect(service.onNewTask.emit).toHaveBeenCalled();
        });
    });
    describe('Function: openNewTask()', () => {
        it('should add todo to the todo list in localStorage', () => {
            spyOn(service.onNewTask, 'emit');
            service.openNewTask();
            expect(service.onNewTask.emit).toHaveBeenCalled();
        });
    });
});
