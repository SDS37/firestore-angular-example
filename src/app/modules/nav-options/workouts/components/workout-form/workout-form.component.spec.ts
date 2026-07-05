import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkoutFormComponent } from './workout-form.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, WorkoutFormComponent, ...MATERIAL_IMPORTS]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit create events for valid strength workouts', () => {
    spyOn(component.create, 'emit');
    component.form.setValue({
      name: 'Bench press',
      type: 'strength',
      strength: { reps: 8, sets: 3, weight: 60 },
      endurance: { distance: 0, duration: 0 }
    });

    component.createWorkout();

    expect(component.create.emit).toHaveBeenCalled();
  });
});
