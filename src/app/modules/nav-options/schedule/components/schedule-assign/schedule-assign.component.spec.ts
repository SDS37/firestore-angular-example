import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ScheduleAssignComponent } from './schedule-assign.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ScheduleAssignComponent', () => {
  let component: ScheduleAssignComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ScheduleAssignComponent]
    }).compileComponents();

    component = TestBed.createComponent(ScheduleAssignComponent).componentInstance;
    component.section = {
      type: 'meals',
      assigned: ['Soup'],
      data: { meals: ['Soup'], workouts: null, section: 'morning', timestamp: 1 },
      section: 'morning',
      day: new Date('2026-07-02T12:00:00')
    };
    component.list = [{
      name: 'Soup',
      ingredients: ['water'],
      timestamp: 1,
      $key: '1',
      $exists: () => true
    }];
    component.ngOnInit();
  });

  it('should toggle by document id and treat a legacy name as selected', () => {
    const soup = component.list?.[0];
    expect(soup).toBeDefined();
    if (!soup) {
      return;
    }

    expect(component.exists(soup)).toBe(true);

    component.toggleItem(soup);
    expect(component.exists(soup)).toBe(false);

    component.toggleItem(soup);
    expect(component.exists(soup)).toBe(true);
  });

  it('should emit document ids, including a legacy name rewritten to its id', () => {
    vi.spyOn(component.updatingItems, 'emit');

    component.updateAssign();

    expect(component.updatingItems.emit).toHaveBeenCalledWith({ meals: ['1'] });
  });

  it('should build create routes from section type', () => {
    expect(component.getRoute('meals')).toEqual(['../meals/new']);
    expect(component.getRoute('workouts')).toEqual(['../workouts/new']);
  });
});
