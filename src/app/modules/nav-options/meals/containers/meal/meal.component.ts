import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { MealFormComponent } from '../../components/meal-form/meal-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

// services
import { MealsService } from 'src/app/modules/nav-options/shared/services/meals/meals.service';

// interfaces
import { Meal } from 'src/app/models/meal.interface';
import { deleteFailureMessage } from 'src/app/utils/schedule-cleanup-error';

// rxjs
import { of, EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'meal',
  imports: [MealFormComponent, MatCardModule, MatProgressBarModule],
  template: `
  <div
    id="meal"
    class="flex-column-container flex-justify-content-stretch flex-align-items-stretch margin-0-auto height-100-100 max-width-600">

    <mat-card class="margin-bottom-10">
      @if (meal(); as meal) {
<h1>
        {{ meal.name ? 'Edit' : 'Create' }} meal
      </h1>
} @else {

        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      
}
      
    </mat-card>

    <mat-card class="margin-bottom-10">
      @if (meal(); as meal) {
<div>
        <meal-form
          [meal]="meal"
          [pending]="saving()"
          (create)="addMeal($event)"
          (update)="updateMeal($event)"
          (delete)="deleteMeal($event)">
        </meal-form>
      </div>
} @else {

        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      
}
      
    </mat-card>

  </div>
  `
})

export class MealComponent {
  private mealsService = inject(MealsService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  readonly meal = toSignal(
    this.activatedRoute.params.pipe(
      switchMap(param => this.mealsService.getMeal(param.id).pipe(
        tap(meal => {
          if (param.id && meal === undefined) {
            void this.router.navigate(['/meals']);
          }
        }),
        switchMap(meal => meal ? of(meal) : EMPTY)
      ))
    ),
    { initialValue: undefined }
  );
  readonly saving = signal(false);

  constructor() {
    toSignal(this.mealsService.meals$);
  }

  async addMeal(event: Meal): Promise<void> {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    try {
      await this.mealsService.addMeal(event);
      this.backToMeals();
    } catch {
      this.saving.set(false);
      this.reportFailure('Could not save the meal.');
    }
  }

  async updateMeal(event: Meal): Promise<void> {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    try {
      const key = this.activatedRoute.snapshot.params.id;
      await this.mealsService.updateMeal(key, event);
      this.backToMeals();
    } catch {
      this.saving.set(false);
      this.reportFailure('Could not save the meal.');
    }
  }

  async deleteMeal(_event: Meal): Promise<void> {
    try {
      const key = this.activatedRoute.snapshot.params.id;
      await this.mealsService.deleteMeal(key);
      this.backToMeals();
    } catch (error: unknown) {
      this.reportFailure(deleteFailureMessage(error, 'Could not delete the meal.'));
    }
  }

  private reportFailure(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 8000 });
  }

  backToMeals(): void {
    this.router.navigate(['/meals']);
  }

}
