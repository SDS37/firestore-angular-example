import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleSectionComponent } from './schedule-section.component';
import { JoinPipe } from 'src/app/modules/nav-options/shared/pipes/join.pipe';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';
import { ScheduleItem } from 'src/app/models/schedule-item.interface';

describe('ScheduleSectionComponent', () => {
  let component: ScheduleSectionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSectionComponent, JoinPipe, ...MATERIAL_IMPORTS]
    }).compileComponents();

    component = TestBed.createComponent(ScheduleSectionComponent).componentInstance;
    component.section = {
      meals: ['Omelette'],
      workouts: null,
      section: 'morning',
      timestamp: 1
    } as ScheduleItem;
  });

  it('should emit section selection events', () => {
    spyOn(component.selectingSection, 'emit');

    component.onSelect('meals', ['Omelette']);

    expect(component.selectingSection.emit).toHaveBeenCalledWith({
      type: 'meals',
      assigned: ['Omelette'],
      data: component.section
    });
  });
});
