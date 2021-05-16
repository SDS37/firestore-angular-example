import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

// interfaces
import { Meal } from 'src/app/models/meal.interface';

@Component({
  selector: 'meal-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]="form">

    <div class="margin-bottom-10 border-radius-5 padding-10 background-color-gray-1">

      <label>
        <h3>Meal name:</h3>
        <mat-form-field class="width-100-100">
          <input
            matInput
            type="text"
            formControlName="name">
          <mat-hint>e.g. huevos a la ranchera</mat-hint>
          <mat-error *ngIf="required">
          Meal name is <strong>required</strong>
          </mat-error>
        </mat-form-field>
      </label>

    </div>

    <div class="flex-column-container margin-bottom-10 border-radius-5 padding-10 background-color-gray-1">

      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">
        <h3>Ingredients:</h3>
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="addIngredientField()">
          Add ingredient
        </button>
      </div>

      <div formArrayName="ingredients">
        <label
          class="flex-row-container flex-justify-content-start flex-align-items-center"
          *ngFor="let c of ingredients.controls; index as ind">
          <mat-form-field class="width-100-100">
            <input matInput [formControlName]="ind">
            <mat-hint>e.g. eggs</mat-hint>
          </mat-form-field>
          <button mat-icon-button type="button" (click)="removeIngredient(ind)">
            <mat-icon color="warn" aria-hidden="false" aria-label="Removes ingredient">highlight_off</mat-icon>
          </button>
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
          (click)="createMeal()">
          Create meal
        </button>

        <button
          *ngIf="exists"
          mat-raised-button
          color="primary"
          type="button"
          (click)="updateMeal()">
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

export class MealFormComponent implements OnChanges {

  @Input() meal: Meal;
  @Output() create = new EventEmitter<Meal>();
  @Output() update = new EventEmitter<Meal>();
  @Output() delete = new EventEmitter<Meal>();

  toggled = false;
  exists = false;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    // empty array in fb to initialize app
    ingredients: this.fb.array([''])
  });

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.meal && changes.meal.currentValue.name) {
    // if (this.meal && this.meal.name) {
      this.exists = true;
      this.emptyIngredients();
      // const value = this.meal;
      // patch value does not update a form array.
      // therefore the array must get empty and repopulated manually
      this.form.patchValue(this.meal);
      if (this.meal.ingredients) {
        for (const ingredient of this.meal.ingredients) {
          this.ingredients.push(new FormControl(ingredient));
        }
      }
    }
  }

  emptyIngredients(): void {
    while (this.ingredients.controls.length) {
      this.ingredients.removeAt(0);
    }
  }

  get required(): boolean {
    return (this.form.get('name').hasError('required') && this.form.get('name').touched);
  }

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  addIngredientField(): void {
    // as FormArray
    this.ingredients.push(new FormControl(''));
  }

  removeIngredient(index: number): void {
    // as FormArray
    this.ingredients.removeAt(index);
  }

  createMeal(): void {
    if (this.form.valid) {
      this.create.emit(this.form.value);
    }
  }

  updateMeal(): void {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  deleteMeal(): void {
    this.delete.emit(this.form.value);
  }

  toggle(): void {
    this.toggled = !this.toggled;
  }

}
