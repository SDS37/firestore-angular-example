import { Component, input, output, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JoinPipe } from '../../pipes/join.pipe';
import { WorkoutPipe } from '../../pipes/workout.pipe';
import { Meal } from 'src/app/models/meal.interface';
import { Workout } from 'src/app/models/workout.interface';

@Component({
  selector: 'list-item',
  imports: [RouterLink, MatDividerModule, MatButtonModule, MatIconModule, JoinPipe, WorkoutPipe],
  template: `
    <div
      class="flex-row-container flex-justify-content-space-between flex-align-items-center padding-10 background-color-gray-2">

      <a
        class="padding-0"
        [routerLink]="getRoute(item())">
        <p>{{ item().name }}</p>
        <p class="font-italic-small">
          @let current = item();
          @if (isMeal(current)) {
            <span>{{ current.ingredients | join }}</span>
          } @else {
            {{ asWorkout(current) | workout }}
          }
        </p>
      </a>

      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">

        @if (toggled()) {
<div
         
          class="flex-row-container flex-justify-content-space-between flex-align-items-center">
          <button
            mat-icon-button
            type="button"
            (click)="removeItem()">
            <mat-icon color="warn" aria-hidden="false" [attr.aria-label]="deleteLabel">delete</mat-icon>
          </button>
          <button
            mat-icon-button
            type="button"
            (click)="toggle()">
            <mat-icon aria-hidden="false" [attr.aria-label]="cancelDeleteLabel">cancel</mat-icon>
          </button>
        </div>
}

        <button
          mat-raised-button
          color="warn"
          type="button"
          (click)="toggle()">
          trash
        </button>

      </div>

    </div>

    <mat-divider></mat-divider>
  `
})

export class ListItemComponent<T extends Meal | Workout = Meal | Workout> {

  readonly item = input.required<T>();
  readonly remove = output<T>();

  readonly toggled = signal(false);

  toggle(): void {
    this.toggled.update(value => !value);
  }

  removeItem(): void {
    this.remove.emit(this.item());
  }

  get deleteLabel(): string {
    return this.isMeal(this.item()) ? 'Delete meal' : 'Delete workout';
  }

  get cancelDeleteLabel(): string {
    return this.isMeal(this.item()) ? 'Cancel delete meal' : 'Cancel delete workout';
  }

  isMeal(item: Meal | Workout): item is Meal {
    return 'ingredients' in item;
  }

  asWorkout(item: Meal | Workout): Workout {
    return item as Workout;
  }

  getRoute(item: Meal | Workout): string[] {
    return [
      `../${ this.isMeal(item) ? 'meals' : 'workouts'}`,
      item.$key];
  }

}
