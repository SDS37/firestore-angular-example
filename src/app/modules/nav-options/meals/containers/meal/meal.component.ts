import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// services
import { MealsService } from 'src/app/modules/nav-options/shared/services/meals/meals.service';

// interfaces
import { Meal } from 'src/app/models/meal.interface';

// rxjs
import { Observable, Subscription, of, EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'meal',
  template: `
  <div
    id="meal"
    class="flex-column-container flex-justify-content-stretch flex-align-items-stretch margin-0-auto height-100-100 max-width-600">

    <mat-card class="margin-bottom-10">
      <h1 *ngIf="meal$ | async as meal; else title;">
        {{ meal.name ? 'Edit' : 'Create' }} meal
      </h1>
      <ng-template #title>
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </ng-template>
    </mat-card>

    <mat-card class="margin-bottom-10">
      <div *ngIf="meal$ | async as meal; else loading;">
        <meal-form
          [meal]="meal"
          (create)="addMeal($event)"
          (update)="updateMeal($event)"
          (delete)="deleteMeal($event)">
        </meal-form>
      </div>
      <ng-template #loading>
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </ng-template>
    </mat-card>

  </div>
  `
})

export class MealComponent implements OnInit, OnDestroy {

  meal$: Observable<Meal>;
  subscription: Subscription;

  constructor(
    private mealsService: MealsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.mealsService.meals$.subscribe();
    this.meal$ = this.activatedRoute.params.pipe(
      switchMap(param => this.mealsService.getMeal(param.id).pipe(
        tap(meal => {
          if (param.id && meal === undefined) {
            void this.router.navigate(['/meals']);
          }
        }),
        switchMap(meal => meal ? of(meal) : EMPTY)
      ))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async addMeal(event: Meal): Promise<void> {
    try {
      await this.mealsService.addMeal(event);
      this.backToMeals();
    } catch (error) {
      console.error(error);
    }
  }

  async updateMeal(event: Meal): Promise<void> {
    try {
      const key = this.activatedRoute.snapshot.params.id;
      await this.mealsService.updateMeal(key, event);
      this.backToMeals();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteMeal(_event: Meal): Promise<void> {
    try {
      const key = this.activatedRoute.snapshot.params.id;
      await this.mealsService.deleteMeal(key);
      this.backToMeals();
    } catch (error) {
      console.error(error);
    }
  }

  backToMeals(): void {
    this.router.navigate(['/meals']);
  }

}
