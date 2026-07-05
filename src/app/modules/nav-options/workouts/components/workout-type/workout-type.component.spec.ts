import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutTypeComponent } from './workout-type.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';

describe('WorkoutTypeComponent', () => {
  let component: WorkoutTypeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutTypeComponent, ...MATERIAL_IMPORTS]
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
