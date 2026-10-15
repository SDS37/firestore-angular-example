import { Component, ViewEncapsulation, input, output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// interfaces
import { ScheduleItem } from 'src/app/models/schedule-item.interface';
import { ScheduleSectionEvent } from 'src/app/models/schedule-section-event.interface';
import { JoinPipe } from '../../../shared/pipes/join.pipe';
import { Meal } from 'src/app/models/meal.interface';
import { Workout } from 'src/app/models/workout.interface';
import { scheduleEntryLabel } from 'src/app/utils/schedule-labels';

@Component({
  selector: 'schedule-section',
  imports: [MatIconModule, MatDividerModule, JoinPipe],
  styleUrls: ['schedule-section.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
  <div class="flex-column-container flex-justify-content-center flex-align-items-stretch">

    <div class="flex-column-container flex-align-items-center padding-10 background-color-blue-1 color-white">
      {{ name().toUpperCase() }}
    </div>

    @if (section().meals) {
<button
      type="button"
     
      class="section-action flex-row-container flex-justify-content-start flex-align-items-center padding-10 cursor-pointer background-color-gray-1"
      (click)="onSelect('meals', section().meals ?? [])">
      <mat-icon color="primary" aria-hidden="true">fastfood</mat-icon>
      <span class="margin-left-10">{{ labelsFor('meals') | join }}</span>
    </button>
} @else {

      <button
        type="button"
        class="section-action flex-row-container flex-justify-content-start flex-align-items-center cursor-pointer padding-10 background-color-gray-2"
        (click)="onSelect('meals')">
        <mat-icon color="primary" aria-hidden="true">control_point</mat-icon>
        <span class="margin-left-10">Assign meal</span>
      </button>
    
}
    

    <mat-divider></mat-divider>

    @if (section().workouts) {
<button
      type="button"
     
      class="section-action flex-row-container flex-justify-content-start flex-align-items-center padding-10 cursor-pointer background-color-gray-1"
      (click)="onSelect('workouts', section().workouts ?? [])">
      <mat-icon color="primary" aria-hidden="true">fitness_center</mat-icon>
      <span class="margin-left-10">{{ labelsFor('workouts') | join }}</span>
    </button>
} @else {

      <button
        type="button"
        class="section-action flex-row-container flex-justify-content-start flex-align-items-center cursor-pointer padding-10 background-color-gray-2"
        (click)="onSelect('workouts')">
        <mat-icon color="primary" aria-hidden="true">control_point</mat-icon>
        <span class="margin-left-10">Assign workout</span>
      </button>
    
}
    

  </div>
  `
})

// <pre>{{ section | json }}</pre>

export class ScheduleSectionComponent {

  readonly name = input.required<string>();
  readonly section = input.required<ScheduleItem>();
  readonly meals = input<Meal[] | null | undefined>(null);
  readonly workouts = input<Workout[] | null | undefined>(null);

  readonly selectingSection = output<Pick<ScheduleSectionEvent, 'type' | 'assigned' | 'data'>>();

  labelsFor(kind: 'meals' | 'workouts'): string[] {
    const values = this.section()[kind] ?? [];
    const catalog = kind === 'meals' ? this.meals() : this.workouts();
    return values.map(value => scheduleEntryLabel(value, catalog));
  }

  onSelect(type: string, assigned: string[] = []): void {
    const data: ScheduleItem = this.section();
    this.selectingSection.emit({
      type,
      assigned,
      data
    });
  }

}
