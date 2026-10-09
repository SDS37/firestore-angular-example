import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JoinPipe } from '../../pipes/join.pipe';
import { WorkoutPipe } from '../../pipes/workout.pipe';

@Component({
  standalone: true,
  selector: 'list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterLink, MatDividerModule, MatButtonModule, MatIconModule, JoinPipe, WorkoutPipe],
  template: `
    <div
      class="flex-row-container flex-justify-content-space-between flex-align-items-center padding-10 background-color-gray-2">

      <a
        class="padding-0"
        [routerLink]="getRoute(item)">
        <p>{{ item.name }}</p>
        <p class="font-italic-small">
          <span *ngIf="item.ingredients; else showWorkout">{{ item.ingredients | join }}</span>
        </p>
        <ng-template #showWorkout>
          {{ item | workout }}
        </ng-template>
      </a>

      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">

        <div
          *ngIf="toggled"
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

export class ListItemComponent {

  @Input() item: any;
  @Output() remove = new EventEmitter<any>();

  toggled = false;

  toggle(): void {
    this.toggled = !this.toggled;
  }

  removeItem(): void {
    this.remove.emit(this.item);
  }

  get deleteLabel(): string {
    return this.item.ingredients ? 'Delete meal' : 'Delete workout';
  }

  get cancelDeleteLabel(): string {
    return this.item.ingredients ? 'Cancel delete meal' : 'Cancel delete workout';
  }

  getRoute(item: any): any[] {
    return [
      `../${ item.ingredients ? 'meals' : 'workouts'}`,
      item.$key];
  }

}
