import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WorkoutTypeComponent } from '../workout-type/workout-type.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// interfaces
import { Workout } from 'src/app/models/workout.interface';

@Component({
  standalone: true,
  selector: 'workout-form',
  imports: [ReactiveFormsModule, RouterLink, WorkoutTypeComponent, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <mat-error *ngIf="required">
            Workout name is <strong>required</strong>
          </mat-error>
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

      <div
        *ngIf="form.get('type')?.value === 'strength'"
        class="flex-column-container"
        formGroupName="strength">
        <mat-form-field class="width-100-100 margin-bottom-10">
          <mat-label>Reps</mat-label>
          <input matInput type="number" formControlName="reps"/>
          <mat-hint>how many repetitions?</mat-hint>
        </mat-form-field>
        <mat-form-field class="width-100-100 margin-bottom-10">
          <mat-label>Sets</mat-label>
          <input matInput type="number" formControlName="sets"/>
          <mat-hint>how many sets?</mat-hint>
        </mat-form-field>
        <mat-form-field class="width-100-100">
          <mat-label>Weight (kg)</mat-label>
          <input matInput type="number" formControlName="weight"/>
          <mat-hint>how much weight?</mat-hint>
        </mat-form-field>
      </div>

      <div
        *ngIf="form.get('type')?.value === 'endurance'"
        class="flex-column-container"
        formGroupName="endurance">
        <mat-form-field class="width-100-100 margin-bottom-10">
          <mat-label>Distance (km)</mat-label>
          <input matInput type="number" formControlName="distance"/>
          <mat-hint>how many kilometers?</mat-hint>
        </mat-form-field>
        <mat-form-field class="width-100-100">
          <mat-label>Duration (minutes)</mat-label>
          <input matInput type="number" formControlName="duration"/>
          <mat-hint>for how long?</mat-hint>
        </mat-form-field>
      </div>

    </div>

    <div class="flex-row-container flex-justify-content-space-between flex-align-items-center margin-bottom-10">

      <div class="flex-row-container flex-justify-content-start flex-align-items-center">

        <button
          *ngIf="!exists"
          mat-raised-button
          color="primary"
          type="button"
          [disabled]="form.invalid"
          (click)="createWorkout()">
          Create workout
        </button>

        <button
          *ngIf="exists"
          mat-raised-button
          color="primary"
          type="button"
          (click)="updateWorkout()">
          Save
        </button>

        <div
          *ngIf="exists"
          class="flex-row-container flex-justify-content-space-between flex-align-items-center margin-left-10">

          <button
            mat-raised-button
            color="warn"
            type="button"
            (click)="toggle()">
            Delete
          </button>

          <div
            *ngIf="toggled"
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

        </div>

      </div>

      <a [routerLink]="['../']">cancel</a>

    </div>

  </form>
  `
})

export class WorkoutFormComponent implements OnChanges {

  @Input() workout!: Workout;
  @Output() create = new EventEmitter<Workout>();
  @Output() update = new EventEmitter<Workout>();
  @Output() delete = new EventEmitter<Workout>();

  toggled = false;
  exists = false;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    type: 'strength',
    strength: this.fb.group({
      reps: 0,
      sets: 0,
      weight: 0
    }),
    endurance: this.fb.group({
      distance: 0,
      duration: 0
    })
  });

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.workout && changes.workout.currentValue.name) {
      this.exists = true;
      const value = this.workout;
      this.form.patchValue(value);
    }
  }

  get hint(): string {
    return `e.g. ${this.form.get('type')?.value === 'strength' ? 'benchpress' : 'treadmill'}`;
  }

  get required(): boolean {
    const name = this.form.get('name');
    return !!name && name.hasError('required') && name.touched;
  }

  createWorkout(): void {
    if (this.form.valid) {
      this.create.emit(this.form.value);
    } else {
      // console.log('fix to show the errors');
    }
  }

  updateWorkout(): void {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  deleteWorkout(): void {
    this.delete.emit(this.form.value);
  }

  toggle(): void {
    this.toggled = !this.toggled;
  }

}
