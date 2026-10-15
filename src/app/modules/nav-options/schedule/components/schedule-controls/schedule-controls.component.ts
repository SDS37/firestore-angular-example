import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'schedule-controls',
  imports: [DatePipe, MatButtonModule, MatIconModule],
  template: `
  <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">
    <button
      mat-icon-button
      type="button"
      (click)="moveDate(offset - 1)">
      <mat-icon color="primary" aria-hidden="false" aria-label="Last week in calendar">chevron_left</mat-icon>
    </button>
    <p>{{ selected() | date:'yMMMMd' }}</p>
    <button
      mat-icon-button
      type="button"
      (click)="moveDate(offset + 1)">
      <mat-icon color="primary" aria-hidden="false" aria-label="Next week in calendar">chevron_right</mat-icon>
    </button>
  </div>
  `
})
export class ScheduleControlsComponent {

  readonly selected = input.required<Date>();

  readonly movingDate = output<number>();

  offset = 0;

  moveDate(offset: number): void {
    this.offset = offset;
    this.movingDate.emit(offset);
  }

}
