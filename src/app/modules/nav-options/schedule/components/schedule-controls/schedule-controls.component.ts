import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'schedule-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">
    <button
      mat-icon-button
      type="button"
      (click)="moveDate(offset - 1)">
      <mat-icon color="primary" aria-hidden="false" aria-label="Last week in calendar">chevron_left</mat-icon>
    </button>
    <p>{{ selected | date:'yMMMMd' }}</p>
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

  @Input() selected: Date;

  @Output() movingDate = new EventEmitter<number>();

  offset = 0;

  constructor() {}

  moveDate(offset: number): void {
    this.offset = offset;
    this.movingDate.emit(offset);
  }

}
