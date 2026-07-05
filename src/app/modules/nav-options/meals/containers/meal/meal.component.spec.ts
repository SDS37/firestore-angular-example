import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { MealComponent } from './meal.component';
import { MealsService } from 'src/app/modules/nav-options/shared/services/meals/meals.service';
import { MealFormComponent } from '../../components/meal-form/meal-form.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Meal } from 'src/app/models/meal.interface';

describe('MealComponent', () => {
  let component: MealComponent;
  let mealsService: jasmine.SpyObj<MealsService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mealsService = jasmine.createSpyObj('MealsService', ['addMeal', 'updateMeal', 'deleteMeal', 'getMeal'], {
      meals$: of([])
    });
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, MealComponent, MealFormComponent, ...MATERIAL_IMPORTS],
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

  it('should redirect to meals when an unknown id is requested', fakeAsync(() => {
    mealsService.getMeal.and.returnValue(of(undefined));

    component.ngOnInit();
    component.meal$.subscribe();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/meals']);
  }));

  it('should create meals and navigate back to the list', async () => {
    mealsService.getMeal.and.returnValue(EMPTY);
    mealsService.addMeal.and.returnValue(Promise.resolve({ id: 'new-meal' } as never));
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
