import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutTypeComponent } from './workout-type.component';
import { MaterialModule } from 'src/app/modules/shared/material/material.module';

describe('WorkoutTypeComponent', () => {
  let component: WorkoutTypeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [WorkoutTypeComponent]
    }).compileComponents();

    component = TestBed.createComponent(WorkoutTypeComponent).componentInstance;
    component.registerOnChange(jasmine.createSpy('onChange'));
    component.registerOnTouched(jasmine.createSpy('onTouch'));
  });

  it('should write and emit selected workout types', () => {
    component.writeValue('endurance');
    component.setSelected('strength');

    expect(component.value).toBe('strength');
  });
});
