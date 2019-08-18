import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';

// interfaces
import { Meal } from '../../../../../models/meal.interface';
import { Workout } from '../../../../../models/workout.interface';

@Component({
  selector: 'schedule-assign',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['schedule-assign.component.scss'],
  template: `
  <div class="dialog-background-container">

    <div class="dialog flex-column-container flex-justify-content-stretch flex-align-items-stretch">

      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center margin-bottom-10">
        <div class="flex-row-container flex-justify-content-center flex-align-items-center">
          <h1>assign</h1>
          <mat-icon
            class="margin-left-10"
            aria-hidden="false"
            aria-label="Meals/Workouts icon">
            {{ section.type === 'workouts' ? 'fitness_center' : 'fastfood' }}
          </mat-icon>
        </div>
        <a
          class="flex-row-container flex-justify-content-center flex-align-items-center"
          [routerLink]="getRoute(section.type)">
          <mat-icon aria-hidden="false" aria-label="Go to create meal/workout">add</mat-icon>
          <span class="margin-left-10">New</span>
        </a>
      </div>

      <div class="flex-column-container flex-justify-content-stretch flex-align-items-stretch margin-bottom-10">
        <span
          class="flex-row-container flex-justify-content-center flex-align-items-center error"
          *ngIf="!list?.length">
          nothing here to assign
        </span>
        <div
          id="clickable-div-list"
          *ngFor="let item of list"
          class="flex-row-container flex-justify-content-stretch flex-align-items-center padding-10 margin-bottom-10 cursor-pointer"
          [class.active]="exists(item.name)"
          (click)="toggleItem(item.name)">
          <mat-icon aria-hidden="false" aria-label="Meals/Workouts icon">playlist_add</mat-icon>
          <span class="margin-left-10">{{ item.name }}</span>
        </div>
      </div>

      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">
        <button
          mat-button
          (click)="updateAssign()">
          <mat-icon color="primary" aria-hidden="false" aria-label="Update assign">update</mat-icon>
          <span class="padding-left-10">Update</span>
        </button>
        <button
          mat-button
          (click)="cancelAssign()">
          <mat-icon color="warn" aria-hidden="false" aria-label="Cancel assign">cancel</mat-icon>
          <span class="padding-left-10">Cancel</span>
        </button>
      </div>

    </div>

  </div>
  `
})
export class ScheduleAssignComponent implements OnInit {

  @Input() section: any;
  @Input() list: Meal[] | Workout[];

  @Output() updatingItems = new EventEmitter<any>();
  @Output() closingAssign = new EventEmitter<any>();

  private selected: string [] = [];

  // constructor() {}

  ngOnInit(): void {
    // spread operator.
    // allows an iterable such as an array expression or string to be expanded in
    // places where zero or more arguments (for function calls) or elements
    // (for array literals) are expected, or an object expression to be expanded
    // in places where zero or more key-value pairs (for object literals) are expected.
    this.selected = [...this.section.assigned];
  }

  toggleItem(name: string): void {
    if (this.exists(name)) {
      this.selected = this.selected.filter( ( item: string ) => item !== name);
    } else {
      this.selected = [...this.selected, name];
    }
  }

  getRoute(name: string): string[] {
    return [`../${name}/new`];
  }

  exists(name: string): boolean {
    // double bang to convert to boolean
    // ~ bitwise operator NOT. inverts all the bits
    return !!~this.selected.indexOf(name);
  }

  updateAssign(): void {
    this.updatingItems.emit({
      // creating property type dynamically: meals or workouts
      [this.section.type]: this.selected
    });

  }

  cancelAssign(): void {
    this.closingAssign.emit();
  }

}
