import { Component, ViewEncapsulation, input, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'schedule-days',
  imports: [MatButtonModule],
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['schedule-days.component.scss'],
  template: `
  <div class="flex-row-container flex-justify-content-space-around flex-align-items-center margin-bottom-10">
    @for (day of days; track day; let i = $index) {
<button
      mat-mini-fab
      color="primary"
      type="button"
     
      [class.active]="i === selected()"
      (click)="selectDay(i)">
      <span>{{ day }}</span>
    </button>
}
  </div>
  `
})
export class ScheduleDaysComponent {

  readonly selected = input.required<number>();

  readonly selectingDay = output<number>();

  days: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  selectDay(index: number): void {
    this.selectingDay.emit(index);
  }

}
