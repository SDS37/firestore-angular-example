import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { WorkoutComponent } from './workout.component';
import { WorkoutsService } from 'src/app/modules/nav-options/shared/services/workouts/workouts.service';
import { WorkoutFormComponent } from '../../components/workout-form/workout-form.component';
import { WorkoutTypeComponent } from '../../components/workout-type/workout-type.component';
import { MaterialModule } from 'src/app/modules/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Workout } from 'src/app/models/workout.interface';

describe('WorkoutComponent', () => {
  let component: WorkoutComponent;
  let workoutsService: jasmine.SpyObj<WorkoutsService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    workoutsService = jasmine.createSpyObj('WorkoutsService', ['addWorkout', 'updateWorkout', 'deleteWorkout', 'getWorkout'], {
      workouts$: of([])
    });
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, MaterialModule],
      declarations: [WorkoutComponent, WorkoutFormComponent, WorkoutTypeComponent],
      providers: [
        { provide: WorkoutsService, useValue: workoutsService },
        { provide: Router, useValue: router },
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

  it('should redirect to workouts when an unknown id is requested', fakeAsync(() => {
    workoutsService.getWorkout.and.returnValue(of(undefined));

    component.ngOnInit();
    component.workout$.subscribe();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/workouts']);
  }));

  it('should create workouts and navigate back to the list', async () => {
    workoutsService.getWorkout.and.returnValue(EMPTY);
    workoutsService.addWorkout.and.returnValue(Promise.resolve({ id: 'new-workout' } as never));
    component.ngOnInit();

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
});
