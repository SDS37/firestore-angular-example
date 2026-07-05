import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MealFormComponent } from './meal-form.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';
import { Meal } from 'src/app/models/meal.interface';

describe('MealFormComponent', () => {
  let component: MealFormComponent;
  let fixture: ComponentFixture<MealFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, MealFormComponent, ...MATERIAL_IMPORTS]
    }).compileComponents();

    fixture = TestBed.createComponent(MealFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit create events for valid new meals', () => {
    spyOn(component.create, 'emit');
    component.form.setValue({ name: 'Toast', ingredients: ['bread'] });

    component.createMeal();

    expect(component.create.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Toast',
      ingredients: ['bread']
    }));
  });

  it('should populate the form when editing an existing meal', () => {
    const meal: Meal = {
      name: 'Omelette',
      ingredients: ['eggs', 'cheese'],
      timestamp: 1,
      $key: 'meal-1',
      $exists: () => true
    };

    component.meal = meal;
    component.ngOnChanges({
      meal: {
        currentValue: meal,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.exists).toBeTrue();
    expect(component.form.get('name')?.value).toBe('Omelette');
    expect(component.ingredients.length).toBe(2);
  });
});
