import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleCalendarComponent } from './schedule-calendar.component';
import { ScheduleControlsComponent } from '../schedule-controls/schedule-controls.component';
import { ScheduleDaysComponent } from '../schedule-days/schedule-days.component';
import { ScheduleSectionComponent } from '../schedule-section/schedule-section.component';
import { JoinPipe } from 'src/app/modules/nav-options/shared/pipes/join.pipe';
import { MaterialModule } from 'src/app/modules/shared/material/material.module';
import { ScheduleList } from 'src/app/models/schedule-list.interface';

describe('ScheduleCalendarComponent', () => {
  let component: ScheduleCalendarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [
        ScheduleCalendarComponent,
        ScheduleControlsComponent,
        ScheduleDaysComponent,
        ScheduleSectionComponent,
        JoinPipe
      ]
    }).compileComponents();

    component = TestBed.createComponent(ScheduleCalendarComponent).componentInstance;
    component.items = {
      morning: {
        meals: ['Omelette'],
        workouts: null,
        section: 'morning',
        timestamp: 1
      }
    } as ScheduleList;
    component.date = new Date('2026-07-02T12:00:00');
    component.ngOnChanges({});
  });

  it('should return schedule sections by key', () => {
    expect(component.getSection('morning').meals).toEqual(['Omelette']);
    expect(component.getSection('missing').meals).toBeUndefined();
  });

  it('should emit selected section events with the current day', () => {
    spyOn(component.selectedSection, 'emit');

    component.selectSection({
      type: 'meals',
      assigned: ['Omelette'],
      data: component.items.morning
    }, 'morning');

    expect(component.selectedSection.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      section: 'morning',
      day: component.selectedDay
    }));
  });

  it('should emit date changes when selecting a day in the week', () => {
    spyOn(component.changingDate, 'emit');

    component.selectDay(2);

    expect(component.changingDate.emit).toHaveBeenCalled();
  });

  it('should move the calendar by whole weeks', () => {
    spyOn(component.changingDate, 'emit');

    component.onMovingDate(1);

    expect(component.changingDate.emit).toHaveBeenCalled();
  });
});
