import { Mock, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { WorkoutsComponent } from './workouts.component';
import { WorkoutsService } from 'src/app/modules/nav-options/shared/services/workouts/workouts.service';
import { Store } from 'src/app/store/store';
import { ListItemComponent } from 'src/app/modules/nav-options/shared/components/list-item/list-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Workout } from 'src/app/models/workout.interface';

describe('WorkoutsComponent', () => {
  let component: WorkoutsComponent;
  let workoutsService: { deleteWorkout: Mock; workouts$: Observable<any> };
  let snackBar: { open: Mock };

  beforeEach(async () => {
    workoutsService = {
      deleteWorkout: vi.fn().mockResolvedValue(undefined),
      workouts$: of([])
    };
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, WorkoutsComponent, ListItemComponent],
      providers: [
        Store,
        { provide: WorkoutsService, useValue: workoutsService },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    }).compileComponents();

    component = TestBed.createComponent(WorkoutsComponent).componentInstance;
    component.ngOnInit();
  });

  it('should delete workouts and handle failures', async () => {
    const workout: Workout = {
      name: 'Run',
      type: 'endurance',
      strength: {},
      endurance: { distance: 5, duration: 30 },
      timestamp: 1,
      $key: 'workout-1',
      $exists: () => true
    };

    await component.removeWorkout(workout);

    expect(workoutsService.deleteWorkout).toHaveBeenCalledWith('workout-1');
  });

  it('should show a message and stay on the list when delete is rejected', async () => {
    workoutsService.deleteWorkout.mockRejectedValue(new Error('permission denied'));

    await component.removeWorkout({
      name: 'Run',
      type: 'endurance',
      strength: {},
      endurance: { distance: 5, duration: 30 },
      timestamp: 1,
      $key: 'workout-1',
      $exists: () => true
    });

    expect(snackBar.open).toHaveBeenCalledWith('Could not delete the workout.', 'Dismiss', { duration: 8000 });
  });
});
