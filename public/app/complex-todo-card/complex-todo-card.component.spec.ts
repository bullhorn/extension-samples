// NG2
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// APP
import { ComplexTodoCardComponent } from './complex-todo-card.component';

describe('TodoCardComponent', () => {
    let component: ComplexTodoCardComponent;
    let fixture: ComponentFixture<ComplexTodoCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ComplexTodoCardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComplexTodoCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
