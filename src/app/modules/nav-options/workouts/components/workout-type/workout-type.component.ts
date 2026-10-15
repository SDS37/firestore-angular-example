import { Component, ChangeDetectionStrategy, forwardRef, ViewEncapsulation } from '@angular/core';
import { NgFor } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export const TYPE_CONTROL_ACCESOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef( () => WorkoutTypeComponent ),
  multi: true
};

@Component({
  standalone: true,
  selector: 'workout-type',
  providers: [ TYPE_CONTROL_ACCESOR ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workout-type.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  imports: [NgFor, MatIconModule],
  template: `
    <button
      type="button"
      *ngFor="let selector of selectors"
      class="type-option flex-row-container flex-justify-content-center flex-align-items-center padding-10 border-radius-10 cursor-pointer"
      [class.active]="selector === value"
      [attr.aria-pressed]="selector === value"
      (click)="setSelected(selector)">
      <mat-icon aria-hidden="true">
        {{ selector === 'strength' ? 'fitness_center': 'directions_run' }}
      </mat-icon>
      <span class="margin-left-10">{{ selector }}</span>
    </button>
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
