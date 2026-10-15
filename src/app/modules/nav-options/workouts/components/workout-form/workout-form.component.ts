import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';

import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WorkoutTypeComponent } from '../workout-type/workout-type.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// interfaces
import { Workout } from 'src/app/models/workout.interface';

const nonNegative = [Validators.required, Validators.min(0)];

@Component({
  selector: 'workout-form',
  imports: [ReactiveFormsModule, RouterLink, WorkoutTypeComponent, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  template: `
  <form [formGroup]="form">

    <div class="margin-bottom-10 border-radius-5 padding-10 background-color-gray-1">

      <mat-form-field class="width-100-100">
          <mat-label>Workout name</mat-label>
          <input
            matInput
            type="text"
            formControlName="name">
          <mat-hint>{{ hint }}</mat-hint>
          @if (required) {
<mat-error>
            Workout name is <strong>required</strong>
          </mat-error>
}
        </mat-form-field>

      <h3>Type:</h3>
        <workout-type
          id="workout-type"
          class="flex-row-container flex-justify-content-space-around flex-align-items-center margin-bottom-10"
          formControlName="type">
        </workout-type>

    </div>

    <div
      id="workout-form-secondary-fields"
      class="margin-bottom-10 border-radius-5 padding-10 background-color-gray-1">

      @if (form.get('type')?.value === 'strength') {
<div
       
        class="flex-column-container"
        formGroupName="strength">
        <mat-form-field class="width-100-100 margin-bottom-10">
          <mat-label>Reps</mat-label>
          <input matInput type="number" formControlName="reps" min="0"/>
          <mat-hint>how many repetitions?</mat-hint>
          @if (numberInvalid('strength', 'reps')) {
<mat-error>Enter 0 or more</mat-error>
}
        </mat-form-field>
        <mat-form-field class="width-100-100 margin-bottom-10">
          <mat-label>Sets</mat-label>
          <input matInput type="number" formControlName="sets" min="0"/>
          <mat-hint>how many sets?</mat-hint>
          @if (numberInvalid('strength', 'sets')) {
<mat-error>Enter 0 or more</mat-error>
}
        </mat-form-field>
        <mat-form-field class="width-100-100">
          <mat-label>Weight (kg)</mat-label>
          <input matInput type="number" formControlName="weight" min="0"/>
          <mat-hint>how much weight?</mat-hint>
          @if (numberInvalid('strength', 'weight')) {
<mat-error>Enter 0 or more</mat-error>
}
        </mat-form-field>
      </div>
}

      @if (form.get('type')?.value === 'endurance') {
<div
       
        class="flex-column-container"
        formGroupName="endurance">
        <mat-form-field class="width-100-100 margin-bottom-10">
          <mat-label>Distance (km)</mat-label>
          <input matInput type="number" formControlName="distance" min="0"/>
          <mat-hint>how many kilometers?</mat-hint>
          @if (numberInvalid('endurance', 'distance')) {
<mat-error>Enter 0 or more</mat-error>
}
        </mat-form-field>
        <mat-form-field class="width-100-100">
          <mat-label>Duration (minutes)</mat-label>
          <input matInput type="number" formControlName="duration" min="0"/>
          <mat-hint>for how long?</mat-hint>
          @if (numberInvalid('endurance', 'duration')) {
<mat-error>Enter 0 or more</mat-error>
}
        </mat-form-field>
      </div>
}

    </div>

    <div class="flex-row-container flex-justify-content-space-between flex-align-items-center margin-bottom-10">

      <div class="flex-row-container flex-justify-content-start flex-align-items-center">

        @if (!exists()) {
<button
         
          mat-raised-button
          color="primary"
          type="button"
          [disabled]="form.invalid || pending()"
          (click)="createWorkout()">
          Create workout
        </button>
}

        @if (exists()) {
<button
         
          mat-raised-button
          color="primary"
          type="button"
          [disabled]="form.invalid || pending()"
          (click)="updateWorkout()">
          Save
        </button>
}

        @if (exists()) {
<div
         
          class="flex-row-container flex-justify-content-space-between flex-align-items-center margin-left-10">

          <button
            mat-raised-button
            color="warn"
            type="button"
            (click)="toggle()">
            Delete
          </button>

          @if (toggled()) {
<div
           
            class="flex-row-container flex-justify-content-space-between flex-align-items-center">
            <button
              mat-icon-button
              type="button"
              (click)="toggle()">
              <mat-icon aria-hidden="false" aria-label="Cancel delete workout">cancel</mat-icon>
            </button>
            <button
              mat-icon-button
              type="button"
              (click)="deleteWorkout()">
              <mat-icon color="warn" aria-hidden="false" aria-label="Delete workout">delete</mat-icon>
            </button>
          </div>
}

        </div>
}

      </div>

      <a [routerLink]="['../']">cancel</a>

    </div>

  </form>
  `
})

export class WorkoutFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  readonly workout = input.required<Workout>();
  readonly pending = input(false);
  readonly create = output<Workout>();
  readonly update = output<Workout>();
  readonly delete = output<Workout>();

  readonly toggled = signal(false);
  readonly exists = computed(() => !!this.workout().name);

  ngOnInit(): void {
    const workout = this.workout();
    if (!workout.name) {
      return;
    }
    this.form.patchValue(workout);
  }

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    type: 'strength',
    strength: this.fb.group({
      reps: [0, nonNegative],
      sets: [0, nonNegative],
      weight: [0, nonNegative]
    }),
    endurance: this.fb.group({
      distance: [0, nonNegative],
      duration: [0, nonNegative]
    })
  });

  get hint(): string {
    return `e.g. ${this.form.get('type')?.value === 'strength' ? 'benchpress' : 'treadmill'}`;
  }

  get required(): boolean {
    const name = this.form.get('name');
    return !!name && name.hasError('required') && name.touched;
  }

  numberInvalid(groupName: 'strength' | 'endurance', controlName: string): boolean {
    const control = this.form.get([groupName, controlName]);
    return !!control && control.invalid && control.touched;
  }

  createWorkout(): void {
    if (this.form.invalid || this.pending()) {
      this.form.markAllAsTouched();
      return;
    }
    this.create.emit(this.form.value);
  }

  updateWorkout(): void {
    if (this.form.invalid || this.pending()) {
      this.form.markAllAsTouched();
      return;
    }
    this.update.emit(this.form.value);
  }

  deleteWorkout(): void {
    this.delete.emit(this.form.value);
  }

  toggle(): void {
    this.toggled.update(value => !value);
  }

}
