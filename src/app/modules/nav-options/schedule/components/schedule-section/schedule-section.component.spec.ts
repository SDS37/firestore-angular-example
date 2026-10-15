import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleSectionComponent } from './schedule-section.component';
import { JoinPipe } from 'src/app/modules/nav-options/shared/pipes/join.pipe';
import { ScheduleItem } from 'src/app/models/schedule-item.interface';

describe('ScheduleSectionComponent', () => {
  let component: ScheduleSectionComponent;
  let fixture: ComponentFixture<ScheduleSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSectionComponent, JoinPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleSectionComponent);
    component = fixture.componentInstance;
    component.name = 'Morning';
    component.section = {
      meals: ['Omelette'],
      workouts: null,
      section: 'morning',
      timestamp: 1
    } as ScheduleItem;
  });

  it('should emit section selection events', () => {
    vi.spyOn(component.selectingSection, 'emit');

    component.onSelect('meals', ['Omelette']);

    expect(component.selectingSection.emit).toHaveBeenCalledWith({
      type: 'meals',
      assigned: ['Omelette'],
      data: component.section
    });
  });

  it('should resolve stored ids to names and mark a missing meal deleted', () => {
    component.meals = [{
      name: 'Omelette',
      ingredients: ['eggs'],
      timestamp: 1,
      $key: 'meal-1',
      $exists: () => true
    }];
    component.section = {
      ...component.section,
      meals: ['meal-1', 'meal-9']
    };

    expect(component.labelsFor('meals')).toEqual(['Omelette', 'Deleted']);
  });

  it('should offer assign meal as a button', () => {
    component.section = {
      meals: null,
      workouts: null,
      section: 'morning',
      timestamp: 1
    };
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button.section-action');
    expect(buttons[0].textContent).toContain('Assign meal');
  });
});
