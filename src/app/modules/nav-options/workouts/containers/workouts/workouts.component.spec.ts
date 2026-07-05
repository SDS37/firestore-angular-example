import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WorkoutsComponent } from './workouts.component';
import { WorkoutsService } from 'src/app/modules/nav-options/shared/services/workouts/workouts.service';
import { Store } from 'src/app/store/store';
import { ListItemComponent } from 'src/app/modules/nav-options/shared/components/list-item/list-item.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';
import { RouterTestingModule } from '@angular/router/testing';
import { Workout } from 'src/app/models/workout.interface';

describe('WorkoutsComponent', () => {
  let component: WorkoutsComponent;
  let workoutsService: jasmine.SpyObj<WorkoutsService>;

  beforeEach(async () => {
    workoutsService = jasmine.createSpyObj('WorkoutsService', ['deleteWorkout'], {
      workouts$: of([])
    });
    workoutsService.deleteWorkout.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, WorkoutsComponent, ListItemComponent, ...MATERIAL_IMPORTS],
      providers: [
        Store,
        { provide: WorkoutsService, useValue: workoutsService }
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
});
