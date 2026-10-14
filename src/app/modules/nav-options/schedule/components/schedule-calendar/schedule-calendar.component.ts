import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor } from '@angular/common';
import { ScheduleControlsComponent } from '../schedule-controls/schedule-controls.component';
import { ScheduleDaysComponent } from '../schedule-days/schedule-days.component';
import { ScheduleSectionComponent } from '../schedule-section/schedule-section.component';

// interfaces
import { ScheduleItem } from 'src/app/models/schedule-item.interface';
import { ScheduleList } from 'src/app/models/schedule-list.interface';

@Component({
  standalone: true,
  selector: 'schedule-calendar',
  imports: [NgFor, ScheduleControlsComponent, ScheduleDaysComponent, ScheduleSectionComponent],
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

export class ScheduleCalendarComponent implements OnChanges {

  @Input() set date(date: Date | null | undefined) {
    if (date) {
      this.selectedDay = new Date(date.getTime());
    } else {
      this.selectedDay = new Date();
    }
  }
  @Input() items: ScheduleList;

  @Output() changingDate = new EventEmitter<Date>();
  @Output() selectedSection = new EventEmitter<{
    type: string;
    assigned: string[];
    data: ScheduleItem;
    section: string;
    day: Date;
  }>();

  selectedDayIndex: number;
  selectedDay: Date = new Date();
  selectedWeek: Date;

  sections = [
    { key: 'morning', name: 'Morning' },
    { key: 'lunch', name: 'Lunch' },
    { key: 'evening', name: 'Evening' },
    { key: 'snacks', name: 'Snacks and Drinks' }
  ];

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.selectedDay) {
      this.selectedDayIndex = this.getToday(this.selectedDay);
      this.selectedWeek = this.getStartOfWeek(new Date(this.selectedDay));
    }
  }

  getSection(name: string): ScheduleItem {
    return this.items && this.items[name] || {} as ScheduleItem;
  }

  selectSection(
    { type, assigned, data }: { type: string; assigned: string[]; data: ScheduleItem },
    section: string
  ): void {
    this.selectedSection.emit({
      type,
      assigned,
      data,
      section,
      day: this.selectedDay
    });
  }

  selectDay(index: number): void {
    const selectedDay = new Date(this.selectedWeek);
    selectedDay.setDate(selectedDay.getDate() + index);
    this.changingDate.emit(selectedDay);
  }

  onMovingDate(weekOffset: number): void {
    const startOfWeek = this.getStartOfWeek(new Date(this.selectedDay));
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
