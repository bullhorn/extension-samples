// NG2
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// Vendor
import { NovoElementsModule } from 'novo-elements';
// APP
import { TodoCardComponent } from './todo-card.component';
import { TEST_PROVIDERS } from '../../test.providers';

describe('TodoCardComponent', () => {
    let component: TodoCardComponent;
    let fixture: ComponentFixture<TodoCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NovoElementsModule],
            declarations: [TodoCardComponent],
            providers: [...TEST_PROVIDERS]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TodoCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
