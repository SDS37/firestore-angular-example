import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleAssignComponent } from './schedule-assign.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';
import { RouterTestingModule } from '@angular/router/testing';

describe('ScheduleAssignComponent', () => {
  let component: ScheduleAssignComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ScheduleAssignComponent, ...MATERIAL_IMPORTS]
    }).compileComponents();

    component = TestBed.createComponent(ScheduleAssignComponent).componentInstance;
    component.section = { type: 'meals', assigned: ['Soup'] };
    component.list = [{
      name: 'Soup',
      ingredients: ['water'],
      timestamp: 1,
      $key: '1',
      $exists: () => true
    }];
    component.ngOnInit();
  });

  it('should toggle selected assignment items', () => {
    expect(component.exists('Soup')).toBeTrue();

    component.toggleItem('Soup');
    expect(component.exists('Soup')).toBeFalse();

    component.toggleItem('Salad');
    expect(component.exists('Salad')).toBeTrue();
  });

  it('should emit updated assignments', () => {
    spyOn(component.updatingItems, 'emit');

    component.updateAssign();

    expect(component.updatingItems.emit).toHaveBeenCalledWith({ meals: ['Soup'] });
  });

  it('should build create routes from section type', () => {
    expect(component.getRoute('meals')).toEqual(['../meals/new']);
    expect(component.getRoute('workouts')).toEqual(['../workouts/new']);
  });
});
