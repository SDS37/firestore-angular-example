import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// services
import { WorkoutsService } from '../../../shared/services/workouts/workouts.service';

// interfaces
import { Workout } from '../../../../../models/workout.interface';

// rxjs
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'workout',
  template: `
  <div
    id="workout"
    class="flex-column-container flex-justify-content-stretch flex-align-items-stretch margin-0-auto height-100-100 max-width-600">

    <mat-card class="margin-bottom-10">
      <h1 *ngIf="workout$ | async as workout; else title;">
        {{ workout.name ? 'Edit' : 'Create' }} workout
      </h1>
      <ng-template #title>
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </ng-template>
    </mat-card>

    <mat-card class="margin-bottom-10">
      <div *ngIf="workout$ | async as workout; else loading;">
        <workout-form
          [workout]="workout"
          (create)="addWorkout($event)"
          (update)="updateWorkout($event)"
          (delete)="deleteWorkout($event)">
        </workout-form>
      </div>
      <ng-template #loading>
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </ng-template>
    </mat-card>

  </div>
  `
})

export class WorkoutComponent implements OnInit, OnDestroy {

  workout$: Observable<Workout>;
  subscription: Subscription;

  constructor(
    private workoutsService: WorkoutsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.workoutsService.workouts$.subscribe();
    this.workout$ = this.activatedRoute.params.pipe(
      switchMap( param => this.workoutsService.getWorkout(param.id))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async addWorkout(event: Workout): Promise<void> {
    await this.workoutsService.addWorkout(event);
    this.backToWorkouts();
  }

  async updateWorkout(event: Workout): Promise<void> {
    const key = this.activatedRoute.snapshot.params.id;
    await this.workoutsService.updateWorkout(key, event);
    this.backToWorkouts();
  }

  async deleteWorkout(event: Workout): Promise<void> {
    const key = this.activatedRoute.snapshot.params.id;
    await this.workoutsService.deleteWorkout(key);
    this.backToWorkouts();
  }

  backToWorkouts(): void {
    this.router.navigate(['workouts']);
  }

}
