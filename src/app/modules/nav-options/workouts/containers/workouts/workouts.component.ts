import { Component, OnInit, OnDestroy } from '@angular/core';

// rxjs
import { Observable, Subscription } from 'rxjs';

// store
import { Store } from 'src/app/store/store';

// services
import { WorkoutsService } from 'src/app/modules/nav-options/shared/services/workouts/workouts.service';

// interfaces
import { Workout } from 'src/app/models/workout.interface';

@Component({
  selector: 'workouts',
  template: `
  <div
    id="workouts"
    class="
      flex-column-container
      flex-justify-content-stretch
      flex-align-items-stretch
      margin-0-auto
      margin-bottom-10
      height-100-100
      max-width-600">

    <mat-card class="margin-bottom-10">
      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">
        <h1>Workouts</h1>
        <a
          class="flex-row-container flex-justify-content-center flex-align-items-center border-radius-5"
          [routerLink]="['../workouts/new']">
          <mat-icon aria-hidden="false" aria-label="Add workout">add</mat-icon>
          <span>New</span>
        </a>
      </div>
    </mat-card>

    <div
      *ngIf="workouts$ | async as workouts; else loading;"
      class="flex-column-container flex-1-1-auto overflow-y-scroll scrollbar-width-none">
      <div
        *ngIf="!workouts.length"
        class="flex-row-container flex-justify-content-space-between flex-align-items-center padding-10 background-color-gray-1">
        <mat-icon color="warn" aria-hidden="false" aria-label="Logout">error_outline</mat-icon>
        <span>No workouts, add a new workout to start</span>
      </div>
      <list-item
        *ngFor="let workout of workouts"
        [item]="workout"
        (remove)="removeWorkout($event)">
      </list-item>
    </div>

    <ng-template #loading>
      <div class="padding-10 background-color-gray-1">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>
    </ng-template>

  </div>
  `
})

// <pre>{{ workouts$ | async | json }}</pre>

export class WorkoutsComponent implements OnInit, OnDestroy {

  workouts$: Observable<Workout[]>;
  subscription: Subscription;

  constructor(
    private workoutsService: WorkoutsService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.workouts$ = this.store.select<Workout[]>('workouts');
    this.subscription = this.workoutsService.workouts$.subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeWorkout(event: Workout): void {
    this.workoutsService.deleteWorkout(event.$key);
  }

}
