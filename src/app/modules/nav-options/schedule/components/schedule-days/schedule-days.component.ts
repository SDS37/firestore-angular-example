import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'schedule-days',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['schedule-days.component.scss'],
  template: `
  <div class="flex-row-container flex-justify-content-space-around flex-align-items-center margin-bottom-10">
    <button
      mat-mini-fab
      color="primary"
      type="button"
      *ngFor="let day of days; index as i"
      [class.active]="i === selected"
      (click)="selectDay(i)">
      <span>{{ day }}</span>
    </button>
  </div>
  `
})
export class ScheduleDaysComponent {

  @Input() selected: number;

  @Output() selectingDay = new EventEmitter<number>();

  days: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // constructor() {}

  selectDay(index: number): void {
    this.selectingDay.emit(index);
  }

}
