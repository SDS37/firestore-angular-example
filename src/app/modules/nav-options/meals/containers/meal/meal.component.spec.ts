import { Mock, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { MealComponent } from './meal.component';
import { MealsService } from 'src/app/modules/nav-options/shared/services/meals/meals.service';
import { MealFormComponent } from '../../components/meal-form/meal-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Meal } from 'src/app/models/meal.interface';

describe('MealComponent', () => {
  let component: MealComponent;
  let mealsService: {
    addMeal: Mock;
    updateMeal: Mock;
    deleteMeal: Mock;
    getMeal: Mock;
    meals$: Observable<any>;
  };
  let router: { navigate: Mock };

  beforeEach(async () => {
    mealsService = {
      addMeal: vi.fn(),
      updateMeal: vi.fn(),
      deleteMeal: vi.fn(),
      getMeal: vi.fn(),
      meals$: of([])
    };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, MealComponent, MealFormComponent],
      providers: [
        { provide: MealsService, useValue: mealsService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'meal-1' }),
            snapshot: { params: { id: 'meal-1' } }
          }
        }
      ]
    }).compileComponents();

    component = TestBed.createComponent(MealComponent).componentInstance;
  });

  it('should redirect to meals when an unknown id is requested', () => {
    mealsService.getMeal.mockReturnValue(of(undefined));

    component.ngOnInit();
    component.meal$.subscribe();

    expect(router.navigate).toHaveBeenCalledWith(['/meals']);
  });

  it('should create meals and navigate back to the list', async () => {
    mealsService.getMeal.mockReturnValue(EMPTY);
    mealsService.addMeal.mockReturnValue(Promise.resolve({ id: 'new-meal' } as never));
    component.ngOnInit();

    const meal: Meal = {
      name: 'Toast',
      ingredients: ['bread'],
      timestamp: 1,
      $key: '',
      $exists: () => false
    };

    await component.addMeal(meal);

    expect(mealsService.addMeal).toHaveBeenCalledWith(meal);
    expect(router.navigate).toHaveBeenCalledWith(['/meals']);
  });
});
