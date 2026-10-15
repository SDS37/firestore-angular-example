import { Mock, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { MealsComponent } from './meals.component';
import { MealsService } from 'src/app/modules/nav-options/shared/services/meals/meals.service';
import { Store } from 'src/app/store/store';
import { ListItemComponent } from 'src/app/modules/nav-options/shared/components/list-item/list-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Meal } from 'src/app/models/meal.interface';

describe('MealsComponent', () => {
  let component: MealsComponent;
  let mealsService: { deleteMeal: Mock; meals$: Observable<any> };

  beforeEach(async () => {
    mealsService = {
      deleteMeal: vi.fn().mockResolvedValue(undefined),
      meals$: of([])
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MealsComponent, ListItemComponent],
      providers: [
        Store,
        { provide: MealsService, useValue: mealsService }
      ]
    }).compileComponents();

    component = TestBed.createComponent(MealsComponent).componentInstance;
    component.ngOnInit();
  });

  it('should delete meals and handle failures', async () => {
    const meal: Meal = {
      name: 'Toast',
      ingredients: ['bread'],
      timestamp: 1,
      $key: 'meal-1',
      $exists: () => true
    };

    await component.removeMeal(meal);

    expect(mealsService.deleteMeal).toHaveBeenCalledWith('meal-1');
  });
});
