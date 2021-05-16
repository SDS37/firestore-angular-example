import { Component, OnInit, OnDestroy } from '@angular/core';

// rxjs
import { Observable, Subscription } from 'rxjs';

// store
import { Store } from 'src/app/store/store';

// services
import { MealsService } from 'src/app/modules/nav-options/shared/services/meals/meals.service';

// interfaces
import { Meal } from 'src/app/models/meal.interface';

@Component({
  selector: 'meals',
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
          <mat-icon aria-hidden="false" aria-label="Add meal">add</mat-icon>
          <span>New</span>
        </a>
      </div>
    </mat-card>

    <div
      *ngIf="meals$ | async as meals; else loading;"
      class="flex-column-container flex-1-1-auto overflow-y-scroll scrollbar-width-none">
      <div
        *ngIf="!meals.length"
        class="flex-row-container flex-justify-content-space-between flex-align-items-center padding-10 background-color-gray-1">
        <mat-icon color="warn" aria-hidden="false" aria-label="Logout">error_outline</mat-icon>
        <span>No meals, add a new meal to start</span>
      </div>
      <list-item
        *ngFor="let meal of meals"
        [item]="meal"
        (remove)="removeMeal($event)">
      </list-item>
    </div>

    <ng-template #loading>
      <div class="padding-10 background-color-gray-1">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>
    </ng-template>

  </div>
  `
})

// <pre>{{ meals$ | async | json }}</pre>

export class MealsComponent implements OnInit, OnDestroy {

  meals$: Observable<Meal[]>;
  subscription: Subscription;

  constructor(
    private mealsService: MealsService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.meals$ = this.store.select<Meal[]>('meals');
    this.subscription = this.mealsService.meals$.subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeMeal(event: Meal): void {
    this.mealsService.deleteMeal(event.$key);
  }

}
