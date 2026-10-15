import { Mock, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
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
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let scheduleService: {
    updateDate: Mock;
    selectSection: Mock;
    updateItems: Mock;
    schedule$: Observable<any>;
    selected$: Observable<any>;
    list$: Observable<any>;
  };
  let snackBar: { open: Mock };

  beforeEach(async () => {
    scheduleService = {
      updateDate: vi.fn(),
      selectSection: vi.fn(),
      updateItems: vi.fn(),
      schedule$: of({}),
      selected$: of(null),
      list$: of([])
    };
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ScheduleComponent,
        ScheduleCalendarComponent,
        ScheduleAssignComponent,
        ScheduleControlsComponent,
        ScheduleDaysComponent,
        ScheduleSectionComponent
      ],
      providers: [
        Store,
        { provide: ScheduleService, useValue: scheduleService },
        { provide: MealsService, useValue: { meals$: of([]) } },
        { provide: WorkoutsService, useValue: { workouts$: of([]) } },
        { provide: MatSnackBar, useValue: snackBar }
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

    expect(component.open).toBe(true);
    expect(scheduleService.selectSection).toHaveBeenCalledWith(event);
  });

  it('should close the assign dialog after updating items', async () => {
    component.open = true;
    scheduleService.updateItems.mockResolvedValue(undefined);

    await component.updateItems({ meals: ['Soup'] });

    expect(scheduleService.updateItems).toHaveBeenCalledWith({ meals: ['Soup'] });
    expect(component.open).toBe(false);
  });

  it('should keep the assign dialog open and show a message when the write is rejected', async () => {
    component.open = true;
    scheduleService.updateItems.mockRejectedValue(new Error('permission denied'));

    await component.updateItems({ meals: ['Soup'] });

    expect(component.open).toBe(true);
    expect(snackBar.open).toHaveBeenCalledWith('Could not update the schedule.', 'Dismiss', { duration: 8000 });
  });

  it('should ignore a second update while the first write is in flight', async () => {
    let resolveUpdate: (value: void) => void = () => undefined;
    scheduleService.updateItems.mockReturnValue(new Promise(resolve => {
      resolveUpdate = resolve;
    }));

    const first = component.updateItems({ meals: ['Soup'] });
    const second = component.updateItems({ meals: ['Soup'] });
    resolveUpdate();
    await Promise.all([first, second]);

    expect(scheduleService.updateItems).toHaveBeenCalledTimes(1);
  });
});
