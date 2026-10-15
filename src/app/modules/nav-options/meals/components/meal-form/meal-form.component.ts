import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// interfaces
import { Meal } from 'src/app/models/meal.interface';

@Component({
  standalone: true,
  selector: 'meal-form',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, NgIf, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <mat-error *ngIf="required">
          Meal name is <strong>required</strong>
          </mat-error>
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
        <label
          class="flex-row-container flex-justify-content-start flex-align-items-center"
          *ngFor="let c of ingredients.controls; index as ind">
          <mat-form-field class="width-100-100">
            <mat-label>Ingredient</mat-label>
            <input matInput [formControlName]="ind">
            <mat-hint>e.g. eggs</mat-hint>
            <mat-error *ngIf="ingredientInvalid(ind)">
              Ingredient is <strong>required</strong>
            </mat-error>
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
          [disabled]="form.invalid || pending"
          (click)="createMeal()">
          Create meal
        </button>

        <button
          *ngIf="exists"
          mat-raised-button
          color="primary"
          type="button"
          [disabled]="form.invalid || pending"
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

  @Input() meal!: Meal;
  @Input()
  set pending(value: boolean) {
    this.pendingValue = value;
    if (!value) {
      this.emitting = false;
    }
  }
  get pending(): boolean {
    return this.pendingValue;
  }
  @Output() create = new EventEmitter<Meal>();
  @Output() update = new EventEmitter<Meal>();
  @Output() delete = new EventEmitter<Meal>();

  toggled = false;
  exists = false;

  private pendingValue = false;
  private emitting = false;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    ingredients: this.fb.array([this.ingredientControl()], Validators.minLength(1))
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
          this.ingredients.push(this.ingredientControl(ingredient));
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
    if (this.form.invalid || this.pending || this.emitting) {
      this.form.markAllAsTouched();
      return;
    }
    this.emitting = true;
    this.create.emit(this.form.value);
  }

  updateMeal(): void {
    if (this.form.invalid || this.pending || this.emitting) {
      this.form.markAllAsTouched();
      return;
    }
    this.emitting = true;
    this.update.emit(this.form.value);
  }

  deleteMeal(): void {
    this.delete.emit(this.form.value);
  }

  toggle(): void {
    this.toggled = !this.toggled;
  }

  private ingredientControl(value = ''): FormControl {
    return new FormControl(value, [Validators.required, Validators.pattern(/\S/)]);
  }

}
