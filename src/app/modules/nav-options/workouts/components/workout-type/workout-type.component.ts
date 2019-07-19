import { Component, ChangeDetectionStrategy, forwardRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const TYPE_CONTROL_ACCESOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef( () => WorkoutTypeComponent ),
  multi: true
};

@Component({
  selector: 'workout-type',
  providers: [ TYPE_CONTROL_ACCESOR ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workout-type.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div
      *ngFor="let selector of selectors"
      class="flex-row-container flex-justify-content-center flex-align-items-center padding-10 border-radius-10 cursor-pointer"
      [class.active]="selector === value" (click)="setSelected(selector)">
      <mat-icon
        aria-hidden="false"
        attr.aria-label="{{selector === 'strength' ? 'strength ': 'endurance '}} exercises">
        {{ selector === 'strength' ? 'fitness_center': 'directions_run' }}
      </mat-icon>
      <span class="margin-left-10">{{ selector }}</span>
    </div>
  `
})

export class WorkoutTypeComponent implements ControlValueAccessor {

  selectors = ['strength', 'endurance'];
  value: string;

  private onTouch: Function;
  private onModelChange: Function;

  registerOnTouched(fn: Function): void {
    this.onTouch = fn;
  }

  registerOnChange(fn: Function): void {
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
