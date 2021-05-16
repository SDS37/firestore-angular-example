import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

// interfaces
import { ScheduleItem } from 'src/app/models/schedule-item.interface';
import { ScheduleList } from 'src/app/models/schedule-list.interface';

@Component({
  selector: 'schedule-calendar',
  template: `
  <schedule-controls
    [selected]="selectedDay"
    (movingDate)="onMovingDate($event)">
  </schedule-controls>
  <schedule-days
    [selected]="selectedDayIndex"
    (selectingDay)="selectDay($event)">
  </schedule-days>
  <schedule-section
    *ngFor="let section of sections"
    [name]="section.name"
    [section]="getSection(section.key)"
    (selectingSection)="selectSection($event, section.key)">
  </schedule-section>
  `
})

// <pre>items {{ items | json }}</pre>

export class ScheduleCalendarComponent implements OnChanges {

  @Input() set date(date: Date) {
    this.selectedDay = new Date(date.getTime());
  }
  @Input() items: ScheduleList;

  @Output() changingDate = new EventEmitter<Date>();
  @Output() selectedSection = new EventEmitter<any>();

  selectedDayIndex: number;
  selectedDay: Date;
  selectedWeek: Date;

  sections: any[] = [
    { key: 'morning', name: 'Morning' },
    { key: 'lunch', name: 'Lunch' },
    { key: 'evening', name: 'Evening' },
    { key: 'snacks', name: 'Snacks and Drinks' }
  ];

  // constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedDayIndex = this.getToday(this.selectedDay);
    this.selectedWeek = this.getStartOfWeek(new Date(this.selectedDay));
  }

  getSection(name: string): ScheduleItem {
    return this.items && this.items[name] || {};
  }

  selectSection({ type, assigned, data}: any, section: string): void {
    const day: Date = this.selectedDay;
    this.selectedSection.emit({
      type,
      assigned,
      data,
      section,
      day
    });
  }

  selectDay(index: number): void {
    const selectedDay: Date = new Date (this.selectedWeek);
    selectedDay.setDate(selectedDay.getDate() + index);
    this.changingDate.emit(selectedDay);
  }

  onMovingDate(weekOffset: number): void {
   const startOfWeek: Date = this.getStartOfWeek(new Date());
   const startDate: Date = (
     new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate())
   );
   startDate.setDate(startDate.getDate() + (weekOffset * 7));
   this.changingDate.emit(startDate);
  }

  private getToday(date: Date): number {
    let today: number = date.getDay() - 1;
    if (today < 0) {
      today = 6;
    }
    return today;
  }

  private getStartOfWeek(date: Date): Date {
    const day: number = date.getDay();
    const diff: number = date.getDate() - day + (day === 0 ? -6 : 1 );
    return new Date(date.setDate(diff));
  }

}

