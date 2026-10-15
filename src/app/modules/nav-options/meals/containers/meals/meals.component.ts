import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ListItemComponent } from '../../../shared/components/list-item/list-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

// store
import { Store } from 'src/app/store/store';

// services
import { MealsService } from 'src/app/modules/nav-options/shared/services/meals/meals.service';

// interfaces
import { Meal } from 'src/app/models/meal.interface';
import { deleteFailureMessage } from 'src/app/utils/schedule-cleanup-error';

@Component({
  selector: 'meals',
  imports: [RouterLink, ListItemComponent, MatCardModule, MatIconModule, MatProgressBarModule],
  template: `
  <div
    id="meals"
    class="
      flex-column-container
      flex-justify-content-stretch
      flex-align-items-stretch
      margin-0-auto
      margin-bottom-10
      height-100-100
      max-width-600">

    <mat-card class="margin-bottom-10">
      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">
        <h1>Meals</h1>
        <a
          class="flex-row-container flex-justify-content-center flex-align-items-center border-radius-5"
          [routerLink]="['../meals/new']">
          <mat-icon aria-hidden="true">add</mat-icon>
          <span>New</span>
        </a>
      </div>
    </mat-card>

    @if (meals(); as meals) {
<div
     
      class="flex-column-container flex-1-1-auto overflow-y-scroll scrollbar-width-none">
      @if (!meals.length) {
<div
       
        class="flex-row-container flex-justify-content-space-between flex-align-items-center padding-10 background-color-gray-1">
        <mat-icon color="warn" aria-hidden="true">error_outline</mat-icon>
        <span>No meals, add a new meal to start</span>
      </div>
}
      @for (meal of meals; track meal.$key) {
<list-item
       
        [item]="meal"
        (remove)="removeMeal($event)">
      </list-item>
}
    </div>
} @else {

      <div class="padding-10 background-color-gray-1">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>
    
}

    

  </div>
  `
})

export class MealsComponent {
  private mealsService = inject(MealsService);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  readonly meals = toSignal(this.store.select('meals'), { requireSync: true });
  private deleting = new Set<string>();

  constructor() {
    toSignal(this.mealsService.meals$);
  }

  async removeMeal(meal: Meal): Promise<void> {
    if (!meal.$key || this.deleting.has(meal.$key)) {
      return;
    }
    this.deleting.add(meal.$key);
    try {
      await this.mealsService.deleteMeal(meal.$key);
    } catch (error: unknown) {
      this.snackBar.open(deleteFailureMessage(error, 'Could not delete the meal.'), 'Dismiss', { duration: 8000 });
    } finally {
      this.deleting.delete(meal.$key);
    }
  }

}
