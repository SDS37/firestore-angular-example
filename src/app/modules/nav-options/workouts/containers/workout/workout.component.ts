import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkoutFormComponent } from '../../components/workout-form/workout-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

// services
import { WorkoutsService } from 'src/app/modules/nav-options/shared/services/workouts/workouts.service';

// interfaces
import { Workout } from 'src/app/models/workout.interface';
import { deleteFailureMessage } from 'src/app/utils/schedule-cleanup-error';

// rxjs
import { of, EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'workout',
  imports: [WorkoutFormComponent, MatCardModule, MatProgressBarModule],
  template: `
  <div
    id="workout"
    class="flex-column-container flex-justify-content-stretch flex-align-items-stretch margin-0-auto height-100-100 max-width-600">

    <mat-card class="margin-bottom-10">
      @if (workout(); as workout) {
<h1>
        {{ workout.name ? 'Edit' : 'Create' }} workout
      </h1>
} @else {

        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      
}
      
    </mat-card>

    <mat-card class="margin-bottom-10">
      @if (workout(); as workout) {
<div>
        <workout-form
          [workout]="workout"
          [pending]="saving()"
          (create)="addWorkout($event)"
          (update)="updateWorkout($event)"
          (delete)="deleteWorkout($event)">
        </workout-form>
      </div>
} @else {

        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      
}
      
    </mat-card>

  </div>
  `
})

export class WorkoutComponent {
  private workoutsService = inject(WorkoutsService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  readonly workout = toSignal(
    this.activatedRoute.params.pipe(
      switchMap(param => this.workoutsService.getWorkout(param.id).pipe(
        tap(workout => {
          if (param.id && workout === undefined) {
            void this.router.navigate(['/workouts']);
          }
        }),
        switchMap(workout => workout ? of(workout) : EMPTY)
      ))
    ),
    { initialValue: undefined }
  );
  readonly saving = signal(false);

  constructor() {
    toSignal(this.workoutsService.workouts$);
  }

  async addWorkout(event: Workout): Promise<void> {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    try {
      await this.workoutsService.addWorkout(event);
      this.backToWorkouts();
    } catch {
      this.saving.set(false);
      this.reportFailure('Could not save the workout.');
    }
  }

  async updateWorkout(event: Workout): Promise<void> {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    try {
      const key = this.activatedRoute.snapshot.params.id;
      await this.workoutsService.updateWorkout(key, event);
      this.backToWorkouts();
    } catch {
      this.saving.set(false);
      this.reportFailure('Could not save the workout.');
    }
  }

  async deleteWorkout(_event: Workout): Promise<void> {
    try {
      const key = this.activatedRoute.snapshot.params.id;
      await this.workoutsService.deleteWorkout(key);
      this.backToWorkouts();
    } catch (error: unknown) {
      this.reportFailure(deleteFailureMessage(error, 'Could not delete the workout.'));
    }
  }

  private reportFailure(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 8000 });
  }

  backToWorkouts(): void {
    this.router.navigate(['/workouts']);
  }

}
