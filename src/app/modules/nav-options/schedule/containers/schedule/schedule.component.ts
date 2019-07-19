import { Component, OnInit, OnDestroy } from '@angular/core';

// store
import { Store } from '../../../../../store/store';

// services
import { ScheduleService } from '../../../shared/services/schedule/schedule.service';
import { MealsService } from '../../../shared/services/meals/meals.service';
import { WorkoutsService } from '../../../shared/services/workouts/workouts.service';

// rxjs
import { Observable, Subscription } from 'rxjs';

// interfaces
import { ScheduleItem } from 'src/app/models/schedule-item.interface';
import { Meal } from 'src/app/models/meal.interface';
import { Workout } from 'src/app/models/workout.interface';

@Component({
  selector: 'schedule',
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
        [date]="date$ | async"
        [items]="schedule$ | async"
        (changingDate)="changeDate($event)"
        (selectedSection)="changeSection($event)">
      </schedule-calendar>

      <schedule-assign
        *ngIf="open"
        [section]="selected$ | async"
        [list]="list$ | async"
        (updatingItems)="updateItems($event)"
        (closingAssign)="closeAssign()">
      </schedule-assign>

  </div>
  `
})

export class ScheduleComponent implements OnInit, OnDestroy {

  date$: Observable<Date>;
  selected$: Observable<any>;
  list$: Observable<Meal[] | Workout[]>;
  schedule$: Observable<ScheduleItem[]>;
  subscriptions: Subscription[] = [];

  open = false;

  constructor(
    private store: Store,
    private scheduleService: ScheduleService,
    private mealsService: MealsService,
    private workoutService: WorkoutsService
  ) {}

  ngOnInit(): void {
    this.date$ = this.store.select('date');
    this.schedule$ = this.store.select('schedule');
    this.selected$ = this.store.select('selected') ;
    this.list$ = this.store.select('list');
    this.subscriptions = [
      this.scheduleService.schedule$.subscribe(),
      this.scheduleService.selected$.subscribe(),
      this.scheduleService.list$.subscribe(),
      this.scheduleService.items$.subscribe(),
      // to preload data from other nav options
      this.mealsService.meals$.subscribe(),
      this.workoutService.workouts$.subscribe()
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach( subscription  => subscription.unsubscribe() );
  }

  changeSection(event: any): void {
    this.open = true;
    this.scheduleService.selectSection(event);
  }

  changeDate(date: Date): void {
    this.scheduleService.updateDate(date);
  }

  updateItems(items: string[]): void {
    this.scheduleService.updateItems(items);
    this.closeAssign();
  }

  closeAssign(): void {
    this.open = false;
  }

}
