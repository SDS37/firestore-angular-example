import { Mock, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { WorkoutComponent } from './workout.component';
import { WorkoutsService } from 'src/app/modules/nav-options/shared/services/workouts/workouts.service';
import { WorkoutFormComponent } from '../../components/workout-form/workout-form.component';
import { WorkoutTypeComponent } from '../../components/workout-type/workout-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Workout } from 'src/app/models/workout.interface';

describe('WorkoutComponent', () => {
  let component: WorkoutComponent;
  let workoutsService: {
    addWorkout: Mock;
    updateWorkout: Mock;
    deleteWorkout: Mock;
    getWorkout: Mock;
    workouts$: Observable<any>;
  };
  let router: { navigate: Mock };
  let snackBar: { open: Mock };

  beforeEach(async () => {
    workoutsService = {
      addWorkout: vi.fn(),
      updateWorkout: vi.fn(),
      deleteWorkout: vi.fn(),
      getWorkout: vi.fn().mockReturnValue(of({
        name: '',
        type: 'strength',
        strength: { reps: 0, sets: 0, weight: 0 },
        endurance: { distance: 0, duration: 0 },
        timestamp: null,
        $key: '',
        $exists: () => false
      })),
      workouts$: of([])
    };
    router = { navigate: vi.fn() };
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, WorkoutComponent, WorkoutFormComponent, WorkoutTypeComponent],
      providers: [
        { provide: WorkoutsService, useValue: workoutsService },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snackBar },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'workout-1' }),
            snapshot: { params: { id: 'workout-1' } }
          }
        }
      ]
    }).compileComponents();

    component = TestBed.createComponent(WorkoutComponent).componentInstance;
  });

  it('should redirect to workouts when an unknown id is requested', () => {
    workoutsService.getWorkout.mockReturnValue(of(undefined));
    TestBed.createComponent(WorkoutComponent);

    expect(router.navigate).toHaveBeenCalledWith(['/workouts']);
  });

  it('should create workouts and navigate back to the list', async () => {
    workoutsService.addWorkout.mockReturnValue(Promise.resolve({ id: 'new-workout' } as never));

    const workout: Workout = {
      name: 'Run',
      type: 'endurance',
      strength: {},
      endurance: { distance: 5, duration: 30 },
      timestamp: 1,
      $key: '',
      $exists: () => false
    };

    await component.addWorkout(workout);

    expect(workoutsService.addWorkout).toHaveBeenCalledWith(workout);
    expect(router.navigate).toHaveBeenCalledWith(['/workouts']);
  });

  it('should stay on the form and show a message when the save is rejected', async () => {
    workoutsService.addWorkout.mockRejectedValue(new Error('permission denied'));

    await component.addWorkout({
      name: 'Run',
      type: 'endurance',
      strength: {},
      endurance: { distance: 5, duration: 30 },
      timestamp: 1,
      $key: '',
      $exists: () => false
    });

    expect(snackBar.open).toHaveBeenCalledWith('Could not save the workout.', 'Dismiss', { duration: 8000 });
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
