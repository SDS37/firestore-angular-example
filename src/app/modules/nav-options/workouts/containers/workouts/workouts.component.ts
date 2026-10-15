import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ListItemComponent } from '../../../shared/components/list-item/list-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

// store
import { Store } from 'src/app/store/store';

// services
import { WorkoutsService } from 'src/app/modules/nav-options/shared/services/workouts/workouts.service';

// interfaces
import { Workout } from 'src/app/models/workout.interface';
import { deleteFailureMessage } from 'src/app/utils/schedule-cleanup-error';

@Component({
  selector: 'workouts',
  imports: [RouterLink, ListItemComponent, MatCardModule, MatIconModule, MatProgressBarModule],
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
          <mat-icon aria-hidden="true">add</mat-icon>
          <span>New</span>
        </a>
      </div>
    </mat-card>

    @if (workouts(); as workouts) {
<div
     
      class="flex-column-container flex-1-1-auto overflow-y-scroll scrollbar-width-none">
      @if (!workouts.length) {
<div
       
        class="flex-row-container flex-justify-content-space-between flex-align-items-center padding-10 background-color-gray-1">
        <mat-icon color="warn" aria-hidden="true">error_outline</mat-icon>
        <span>No workouts, add a new workout to start</span>
      </div>
}
      @for (workout of workouts; track workout.$key) {
<list-item
       
        [item]="workout"
        (remove)="removeWorkout($event)">
      </list-item>
}
    </div>
} @else {

      <div class="padding-10 background-color-gray-1">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>
    
}

    

  </div>
  `
})

export class WorkoutsComponent {
  private workoutsService = inject(WorkoutsService);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  readonly workouts = toSignal(this.store.select('workouts'), { requireSync: true });
  private deleting = new Set<string>();

  constructor() {
    toSignal(this.workoutsService.workouts$);
  }

  async removeWorkout(workout: Workout): Promise<void> {
    if (!workout.$key || this.deleting.has(workout.$key)) {
      return;
    }
    this.deleting.add(workout.$key);
    try {
      await this.workoutsService.deleteWorkout(workout.$key);
    } catch (error: unknown) {
      this.snackBar.open(deleteFailureMessage(error, 'Could not delete the workout.'), 'Dismiss', { duration: 8000 });
    } finally {
      this.deleting.delete(workout.$key);
    }
  }

}
