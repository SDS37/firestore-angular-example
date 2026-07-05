import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ScheduleComponent } from './schedule.component';
import { ScheduleService } from 'src/app/modules/nav-options/shared/services/schedule/schedule.service';
import { MealsService } from 'src/app/modules/nav-options/shared/services/meals/meals.service';
import { WorkoutsService } from 'src/app/modules/nav-options/shared/services/workouts/workouts.service';
import { Store } from 'src/app/store/store';
import { ScheduleCalendarComponent } from '../../components/schedule-calendar/schedule-calendar.component';
import { ScheduleAssignComponent } from '../../components/schedule-assign/schedule-assign.component';
import { ScheduleControlsComponent } from '../../components/schedule-controls/schedule-controls.component';
import { ScheduleDaysComponent } from '../../components/schedule-days/schedule-days.component';
import { ScheduleSectionComponent } from '../../components/schedule-section/schedule-section.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';
import { RouterTestingModule } from '@angular/router/testing';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let scheduleService: jasmine.SpyObj<ScheduleService>;

  beforeEach(async () => {
    scheduleService = jasmine.createSpyObj('ScheduleService', [
      'updateDate',
      'selectSection',
      'updateItems'
    ], {
      schedule$: of({}),
      selected$: of(null),
      list$: of([]),
      items$: of(undefined)
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ScheduleComponent,
        ScheduleCalendarComponent,
        ScheduleAssignComponent,
        ScheduleControlsComponent,
        ScheduleDaysComponent,
        ScheduleSectionComponent,
        ...MATERIAL_IMPORTS
      ],
      providers: [
        Store,
        { provide: ScheduleService, useValue: scheduleService },
        { provide: MealsService, useValue: { meals$: of([]) } },
        { provide: WorkoutsService, useValue: { workouts$: of([]) } }
      ]
    }).compileComponents();

    component = TestBed.createComponent(ScheduleComponent).componentInstance;
    component.ngOnInit();
  });

  it('should open the assign dialog when a section is selected', () => {
    const event = {
      type: 'meals',
      assigned: [] as string[],
      data: {
        meals: null,
        workouts: null,
        section: 'morning',
        timestamp: 1
      },
      section: 'morning',
      day: new Date()
    };

    component.changeSection(event);

    expect(component.open).toBeTrue();
    expect(scheduleService.selectSection).toHaveBeenCalledWith(event);
  });

  it('should close the assign dialog after updating items', () => {
    component.open = true;

    component.updateItems({ meals: ['Soup'] });

    expect(scheduleService.updateItems).toHaveBeenCalledWith({ meals: ['Soup'] });
    expect(component.open).toBeFalse();
  });
});
