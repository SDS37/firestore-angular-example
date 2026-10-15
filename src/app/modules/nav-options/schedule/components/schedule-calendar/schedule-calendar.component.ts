import { Component, computed, input, output } from '@angular/core';

import { ScheduleControlsComponent } from '../schedule-controls/schedule-controls.component';
import { ScheduleDaysComponent } from '../schedule-days/schedule-days.component';
import { ScheduleSectionComponent } from '../schedule-section/schedule-section.component';

// interfaces
import { ScheduleItem } from 'src/app/models/schedule-item.interface';
import { ScheduleList } from 'src/app/models/schedule-list.interface';
import { ScheduleSectionEvent } from 'src/app/models/schedule-section-event.interface';
import { Meal } from 'src/app/models/meal.interface';
import { Workout } from 'src/app/models/workout.interface';

@Component({
  selector: 'schedule-calendar',
  imports: [ScheduleControlsComponent, ScheduleDaysComponent, ScheduleSectionComponent],
  template: `
  <schedule-controls
    [selected]="selectedDay()"
    (movingDate)="onMovingDate($event)">
  </schedule-controls>
  <schedule-days
    [selected]="selectedDayIndex()"
    (selectingDay)="selectDay($event)">
  </schedule-days>
  @for (section of sections; track section) {
<schedule-section
   
    [name]="section.name"
    [section]="getSection(section.key)"
    [meals]="meals()"
    [workouts]="workouts()"
    (selectingSection)="selectSection($event, section.key)">
  </schedule-section>
}
  `
})

export class ScheduleCalendarComponent {

  readonly date = input<Date | null | undefined>(undefined);
  readonly items = input<ScheduleList | null | undefined>(null);
  readonly meals = input<Meal[] | null | undefined>(null);
  readonly workouts = input<Workout[] | null | undefined>(null);

  readonly changingDate = output<Date>();
  readonly selectedSection = output<ScheduleSectionEvent>();

  readonly selectedDay = computed(() => {
    const date = this.date();
    return date ? new Date(date.getTime()) : new Date();
  });
  readonly selectedDayIndex = computed(() => this.getToday(this.selectedDay()));
  readonly selectedWeek = computed(() => this.getStartOfWeek(new Date(this.selectedDay())));

  sections = [
    { key: 'morning', name: 'Morning' },
    { key: 'lunch', name: 'Lunch' },
    { key: 'evening', name: 'Evening' },
    { key: 'snacks', name: 'Snacks and Drinks' }
  ];

  getSection(name: string): ScheduleItem {
    const items = this.items();
    return items && items[name] || {} as ScheduleItem;
  }

  selectSection(
    { type, assigned, data }: Pick<ScheduleSectionEvent, 'type' | 'assigned' | 'data'>,
    section: string
  ): void {
    this.selectedSection.emit({
      type,
      assigned,
      data,
      section,
      day: this.selectedDay()
    });
  }

  selectDay(index: number): void {
    const selectedDay = new Date(this.selectedWeek());
    selectedDay.setDate(selectedDay.getDate() + index);
    this.changingDate.emit(selectedDay);
  }

  onMovingDate(weekOffset: number): void {
    const startOfWeek = this.getStartOfWeek(new Date(this.selectedDay()));
    const startDate = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate()
    );
    startDate.setDate(startDate.getDate() + (weekOffset * 7));
    this.changingDate.emit(startDate);
  }

  private getToday(date: Date): number {
    let today = date.getDay() - 1;
    if (today < 0) {
      today = 6;
    }
    return today;
  }

  private getStartOfWeek(date: Date): Date {
    const copy = new Date(date.getTime());
    const day = copy.getDay();
    const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
    copy.setDate(diff);
    return copy;
  }

}
