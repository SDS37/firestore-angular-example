import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { WorkoutTypeComponent } from './workout-type.component';

describe('WorkoutTypeComponent', () => {
  let component: WorkoutTypeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutTypeComponent]
    }).compileComponents();

    component = TestBed.createComponent(WorkoutTypeComponent).componentInstance;
    component.registerOnChange(vi.fn());
    component.registerOnTouched(vi.fn());
  });

  it('should write and emit selected workout types', () => {
    component.writeValue('endurance');
    component.setSelected('strength');

    expect(component.value).toBe('strength');
  });
});
