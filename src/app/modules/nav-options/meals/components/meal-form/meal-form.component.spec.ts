import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MealFormComponent } from './meal-form.component';
import { Meal } from 'src/app/models/meal.interface';

describe('MealFormComponent', () => {
  let component: MealFormComponent;
  let fixture: ComponentFixture<MealFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, MealFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MealFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('meal', {
      name: '',
      ingredients: [''],
      timestamp: null,
      $key: '',
      $exists: () => false
    });
  });

  it('should emit create events for valid new meals', () => {
    vi.spyOn(component.create, 'emit');
    component.form.setValue({ name: 'Toast', ingredients: ['bread'] });

    component.createMeal();

    expect(component.create.emit).toHaveBeenCalledWith(expect.objectContaining({
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

    fixture.componentRef.setInput('meal', meal);
    fixture.detectChanges();

    expect(component.exists()).toBe(true);
    expect(component.form.get('name')?.value).toBe('Omelette');
    expect(component.ingredients.length).toBe(2);
  });

  it('should not emit a meal with a blank ingredient', () => {
    vi.spyOn(component.create, 'emit');
    component.form.setValue({ name: 'Toast', ingredients: [' '] });

    component.createMeal();

    expect(component.create.emit).not.toHaveBeenCalled();
  });

  it('should ignore a second create while the first is still pending', () => {
    vi.spyOn(component.create, 'emit');
    component.form.setValue({ name: 'Toast', ingredients: ['bread'] });

    component.createMeal();
    fixture.componentRef.setInput('pending', true);
    component.createMeal();

    expect(component.create.emit).toHaveBeenCalledTimes(1);
  });
});
