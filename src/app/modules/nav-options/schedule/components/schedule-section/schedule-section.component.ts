import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

// interfaces
import { ScheduleItem } from 'src/app/models/schedule-item.interface';

@Component({
  selector: 'schedule-section',
  styleUrls: ['schedule-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  template: `
  <div class="flex-column-container flex-justify-content-center flex-align-items-stretch">

    <div class="flex-column-container flex-align-items-center padding-10 background-color-blue-1 color-white">
      {{ name.toUpperCase() }}
    </div>

    <div
      id="div-as-button"
      *ngIf="section.meals; else addMeal"
      class="flex-row-container flex-justify-content-start flex-align-items-center padding-10 cursor-pointer background-color-gray-1"
      (click)="onSelect('meals', section.meals)">
      <mat-icon color="primary" aria-hidden="false" aria-label="Meals section">fastfood</mat-icon>
      <span class="margin-left-10">{{ section.meals | join }}</span>
    </div>
    <ng-template #addMeal>
      <div
        id="div-as-button"
        class="flex-row-container flex-justify-content-start flex-align-items-center cursor-pointer padding-10 background-color-gray-2"
        (click)="onSelect('meals')">
        <mat-icon color="primary" aria-hidden="false" aria-label="Assign meal">control_point</mat-icon>
        <span class="margin-left-10">Assign meal</span>
      </div>
    </ng-template>

    <mat-divider></mat-divider>

    <div
      id="div-as-button"
      *ngIf="section.workouts; else addWorkout"
      class="flex-row-container flex-justify-content-start flex-align-items-center padding-10 cursor-pointer background-color-gray-1"
      (click)="onSelect('workouts', section.workouts)">
      <mat-icon color="primary" aria-hidden="false" aria-label="Meals section">fitness_center</mat-icon>
      <span class="margin-left-10">{{ section.workouts | join }}</span>
    </div>
    <ng-template #addWorkout>
      <div
        id="div-as-button"
        class="flex-row-container flex-justify-content-start flex-align-items-center cursor-pointer padding-10 background-color-gray-2"
        (click)="onSelect('workouts')">
        <mat-icon color="primary" aria-hidden="false" aria-label="Assign meal">control_point</mat-icon>
        <span class="margin-left-10">Assign workout</span>
      </div>
    </ng-template>

  </div>
  `
})

// <pre>{{ section | json }}</pre>

export class ScheduleSectionComponent {

  @Input() name: string;
  @Input() section: ScheduleItem;

  @Output() selectingSection = new EventEmitter<any>();

  // constructor() {}

  onSelect(type: string, assigned: string[] = []): void {
    const data: ScheduleItem = this.section;
    this.selectingSection.emit({
      type,
      assigned,
      data
    });
  }

}
