import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkoutFormComponent } from './workout-form.component';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, WorkoutFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('workout', {
      name: '',
      type: 'strength',
      strength: { reps: 0, sets: 0, weight: 0 },
      endurance: { distance: 0, duration: 0 },
      timestamp: null,
      $key: '',
      $exists: () => false
    });
    fixture.detectChanges();
  });

  it('should emit create events for valid strength workouts', () => {
    vi.spyOn(component.create, 'emit');
    component.form.setValue({
      name: 'Bench press',
      type: 'strength',
      strength: { reps: 8, sets: 3, weight: 60 },
      endurance: { distance: 0, duration: 0 }
    });

    component.createWorkout();

    expect(component.create.emit).toHaveBeenCalled();
  });

  it('should not emit a workout with a negative number', () => {
    vi.spyOn(component.create, 'emit');
    component.form.setValue({
      name: 'Bench press',
      type: 'strength',
      strength: { reps: -1, sets: 3, weight: 60 },
      endurance: { distance: 0, duration: 0 }
    });

    component.createWorkout();

    expect(component.create.emit).not.toHaveBeenCalled();
  });
});
