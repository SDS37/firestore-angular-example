import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';

import { ReactiveFormsModule, FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// interfaces
import { Meal } from 'src/app/models/meal.interface';

@Component({
  selector: 'meal-form',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  template: `
  <form [formGroup]="form">

    <div class="margin-bottom-10 border-radius-5 padding-10 background-color-gray-1">

      <mat-form-field class="width-100-100">
          <mat-label>Meal name</mat-label>
          <input
            matInput
            type="text"
            formControlName="name">
          <mat-hint>e.g. huevos a la ranchera</mat-hint>
          @if (required) {
<mat-error>
          Meal name is <strong>required</strong>
          </mat-error>
}
        </mat-form-field>

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
        @for (c of ingredients.controls; track c; let ind = $index) {
<label
          class="flex-row-container flex-justify-content-start flex-align-items-center"
         >
          <mat-form-field class="width-100-100">
            <mat-label>Ingredient</mat-label>
            <input matInput [formControlName]="ind">
            <mat-hint>e.g. eggs</mat-hint>
            @if (ingredientInvalid(ind)) {
<mat-error>
              Ingredient is <strong>required</strong>
            </mat-error>
}
          </mat-form-field>
          <button mat-icon-button type="button" (click)="removeIngredient(ind)">
            <mat-icon color="warn" aria-hidden="false" aria-label="Removes ingredient">highlight_off</mat-icon>
          </button>
        </label>
}
      </div>

    </div>

    <div class="flex-row-container flex-justify-content-space-between flex-align-items-center margin-bottom-10">

      <div class="flex-row-container flex-justify-content-start flex-align-items-center">

        @if (!exists()) {
<button
         
          mat-raised-button
          color="primary"
          type="button"
          [disabled]="form.invalid || pending()"
          (click)="createMeal()">
          Create meal
        </button>
}

        @if (exists()) {
<button
         
          mat-raised-button
          color="primary"
          type="button"
          [disabled]="form.invalid || pending()"
          (click)="updateMeal()">
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
              <mat-icon aria-hidden="false" aria-label="Cancel delete meal">cancel</mat-icon>
            </button>
            <button
              mat-icon-button
              type="button"
              (click)="deleteMeal()">
              <mat-icon color="warn" aria-hidden="false" aria-label="Delete meal">delete</mat-icon>
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

export class MealFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  readonly meal = input.required<Meal>();
  readonly pending = input(false);
  readonly create = output<Meal>();
  readonly update = output<Meal>();
  readonly delete = output<Meal>();

  readonly toggled = signal(false);
  readonly exists = computed(() => !!this.meal().name);

  ngOnInit(): void {
    const meal = this.meal();
    if (!meal.name) {
      return;
    }
    this.emptyIngredients();
    this.form.patchValue(meal);
    for (const ingredient of meal.ingredients ?? []) {
      this.ingredients.push(this.ingredientControl(ingredient));
    }
  }

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    ingredients: this.fb.array([this.ingredientControl()], Validators.minLength(1))
  });

  emptyIngredients(): void {
    while (this.ingredients.controls.length) {
      this.ingredients.removeAt(0);
    }
  }

  get required(): boolean {
    const name = this.form.get('name');
    return !!name && name.hasError('required') && name.touched;
  }

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  ingredientInvalid(index: number): boolean {
    const control = this.ingredients.at(index);
    return !!control && control.invalid && control.touched;
  }

  addIngredientField(): void {
    this.ingredients.push(this.ingredientControl());
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length === 1) {
      this.ingredients.at(0).setValue('');
      this.ingredients.at(0).markAsTouched();
      return;
    }
    this.ingredients.removeAt(index);
  }

  createMeal(): void {
    if (this.form.invalid || this.pending()) {
      this.form.markAllAsTouched();
      return;
    }
    this.create.emit(this.form.value);
  }

  updateMeal(): void {
    if (this.form.invalid || this.pending()) {
      this.form.markAllAsTouched();
      return;
    }
    this.update.emit(this.form.value);
  }

  deleteMeal(): void {
    this.delete.emit(this.form.value);
  }

  toggle(): void {
    this.toggled.update(value => !value);
  }

  private ingredientControl(value = ''): FormControl {
    return new FormControl(value, [Validators.required, Validators.pattern(/\S/)]);
  }

}
