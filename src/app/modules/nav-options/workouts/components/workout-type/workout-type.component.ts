import { Component, forwardRef, ViewEncapsulation } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export const TYPE_CONTROL_ACCESOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef( () => WorkoutTypeComponent ),
  multi: true
};

@Component({
  selector: 'workout-type',
  providers: [ TYPE_CONTROL_ACCESOR ],
  styleUrls: ['./workout-type.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  imports: [MatIconModule],
  template: `
    @for (selector of selectors; track selector) {
<button
      type="button"
     
      class="type-option flex-row-container flex-justify-content-center flex-align-items-center padding-10 border-radius-10 cursor-pointer"
      [class.active]="selector === value"
      [attr.aria-pressed]="selector === value"
      (click)="setSelected(selector)">
      <mat-icon aria-hidden="true">
        {{ selector === 'strength' ? 'fitness_center': 'directions_run' }}
      </mat-icon>
      <span class="margin-left-10">{{ selector }}</span>
    </button>
}
  `
})

export class WorkoutTypeComponent implements ControlValueAccessor {

  selectors = ['strength', 'endurance'];
  value!: string;

  private onTouch!: () => void;
  private onModelChange!: (value: string) => void;

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onModelChange = fn;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  setSelected(value: string): void {
    this.value = value;
    this.onModelChange(value);
    this.onTouch();
  }

}
