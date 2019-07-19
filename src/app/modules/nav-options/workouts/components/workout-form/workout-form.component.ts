import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// interfaces
import { Workout } from '../../../../../models/workout.interface';

@Component({
  selector: 'workout-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]="form">

    <div class="margin-bottom-10 border-radius-5 padding-10 background-color-gray-1">

      <label>
        <h3>Workout name:</h3>
        <mat-form-field class="width-100-100">
          <input
            matInput
            type="text"
            formControlName="name">
          <mat-hint>{{ hint }}</mat-hint>
          <mat-error *ngIf="required">
            Workout name is <strong>required</strong>
          </mat-error>
        </mat-form-field>
      </label>

      <label>
        <h3>Type:</h3>
        <workout-type
          id="workout-type"
          class="flex-row-container flex-justify-content-space-around flex-align-items-center margin-bottom-10"
          formControlName="type">
        </workout-type>
      </label>

    </div>

    <div
      id="workout-form-secondary-fields"
      class="margin-bottom-10 border-radius-5 padding-10 background-color-gray-1">

      <div
        *ngIf="form.get('type').value === 'strength'"
        class="flex-row-container flex-justify-content-space-around flex-align-items-center margin-bottom-10"
        formGroupName="strength">
        <label>
          <mat-form-field>
            <h3>Reps</h3>
            <input matInput type="number" formControlName="reps"/>
            <mat-hint>how many repetitions?</mat-hint>
          </mat-form-field>
        </label>
        <label>
          <mat-form-field>
            <h3>Sets</h3>
            <input matInput type="number" formControlName="sets"/>
            <mat-hint>how many sets?</mat-hint>
          </mat-form-field>
        </label>
        <label>
          <mat-form-field>
            <h3>Weight <span>(kg)</span></h3>
            <input matInput type="number" formControlName="weight"/>
            <mat-hint>how much weight?</mat-hint>
          </mat-form-field>
        </label>
      </div>

      <div
        *ngIf="form.get('type').value === 'endurance'"
        class="flex-row-container flex-justify-content-space-around flex-align-items-center margin-bottom-10"
        formGroupName="endurance">
        <label>
          <mat-form-field>
            <h3>Distance <span>(km)</span></h3>
            <input matInput type="number" formControlName="distance"/>
            <mat-hint>how many kilometers?</mat-hint>
          </mat-form-field>
        </label>
        <label>
          <mat-form-field>
          <h3>Duration <span>(minutes)</span></h3>
            <input matInput type="number" formControlName="duration"/>
            <mat-hint>for how long?</mat-hint>
            </mat-form-field>
        </label>
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
              <mat-icon aria-hidden="false" aria-label="Cancel delete meal">cancel</mat-icon>
            </button>
            <button
              mat-icon-button
              type="button"
              (click)="deleteMeal()">
              <mat-icon color="warn" aria-hidden="false" aria-label="Delete meal">delete</mat-icon>
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

  @Input() workout: Workout;
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
    return `e.g. ${this.form.get('type').value === 'strength' ? 'benchpress' : 'treadmill'}`;
  }

  get required(): boolean {
    return (this.form.get('name').hasError('required') && this.form.get('name').touched);
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
