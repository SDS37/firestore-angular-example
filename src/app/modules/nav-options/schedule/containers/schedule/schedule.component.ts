import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScheduleCalendarComponent } from '../../components/schedule-calendar/schedule-calendar.component';
import { ScheduleAssignComponent } from '../../components/schedule-assign/schedule-assign.component';

// store
import { Store } from 'src/app/store/store';

// services
import { ScheduleService } from 'src/app/modules/nav-options/shared/services/schedule/schedule.service';
import { MealsService } from 'src/app/modules/nav-options/shared/services/meals/meals.service';
import { WorkoutsService } from 'src/app/modules/nav-options/shared/services/workouts/workouts.service';

// interfaces
import { ScheduleSectionEvent } from 'src/app/models/schedule-section-event.interface';

@Component({
  selector: 'schedule',
  imports: [MatCardModule, ScheduleCalendarComponent, ScheduleAssignComponent],
  template: `
  <div
    id="schedule"
    class="
      flex-column-container
      flex-justify-content-stretch
      flex-align-items-stretch
      margin-0-auto
      height-100-100
      max-width-600">

      <mat-card class="margin-bottom-10">
        <h1>Schedule</h1>
      </mat-card>

      <schedule-calendar
        class="flex-1-1-auto overflow-y-scroll scrollbar-width-none"
        [date]="date()"
        [items]="schedule()"
        [meals]="meals()"
        [workouts]="workouts()"
        (changingDate)="changeDate($event)"
        (selectedSection)="changeSection($event)">
      </schedule-calendar>

      @if (open()) {
<schedule-assign
       
        [section]="selected()"
        [list]="list()"
        [pending]="updating()"
        (updatingItems)="updateItems($event)"
        (closingAssign)="closeAssign()">
      </schedule-assign>
}

  </div>
  `
})

export class ScheduleComponent {
  private store = inject(Store);
  private scheduleService = inject(ScheduleService);
  private mealsService = inject(MealsService);
  private workoutService = inject(WorkoutsService);
  private snackBar = inject(MatSnackBar);

  readonly date = toSignal(this.store.select('date'), { requireSync: true });
  readonly meals = toSignal(this.store.select('meals'), { requireSync: true });
  readonly workouts = toSignal(this.store.select('workouts'), { requireSync: true });
  readonly schedule = toSignal(this.store.select('schedule'), { requireSync: true });
  readonly selected = toSignal(this.store.select('selected'), { requireSync: true });
  readonly list = toSignal(this.store.select('list'), { requireSync: true });
  readonly open = signal(false);
  readonly updating = signal(false);

  constructor() {
    toSignal(this.scheduleService.schedule$);
    toSignal(this.scheduleService.selected$);
    toSignal(this.scheduleService.list$);
    toSignal(this.mealsService.meals$);
    toSignal(this.workoutService.workouts$);
  }

  changeSection(event: ScheduleSectionEvent): void {
    this.open.set(true);
    this.scheduleService.selectSection(event);
  }

  changeDate(date: Date): void {
    this.scheduleService.updateDate(date);
  }

  async updateItems(items: Record<string, string[]>): Promise<void> {
    if (this.updating()) {
      return;
    }
    this.updating.set(true);
    try {
      await this.scheduleService.updateItems(items);
      this.closeAssign();
    } catch {
      this.updating.set(false);
      this.snackBar.open('Could not update the schedule.', 'Dismiss', { duration: 8000 });
    }
  }

  closeAssign(): void {
    this.open.set(false);
    this.updating.set(false);
  }

}
