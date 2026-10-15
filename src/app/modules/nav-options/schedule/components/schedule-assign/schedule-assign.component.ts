import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// interfaces
import { Meal } from 'src/app/models/meal.interface';
import { Workout } from 'src/app/models/workout.interface';
import { ScheduleSectionEvent } from 'src/app/models/schedule-section-event.interface';

@Component({
  standalone: true,
  selector: 'schedule-assign',
  imports: [NgIf, NgFor, RouterLink, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['schedule-assign.component.scss'],
  template: `
  <div class="dialog-background-container">

    <div class="dialog flex-column-container flex-justify-content-stretch flex-align-items-stretch">

      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center margin-bottom-10">
        <div class="flex-row-container flex-justify-content-center flex-align-items-center">
          <h1>assign</h1>
          <mat-icon class="margin-left-10" aria-hidden="true">
            {{ section?.type === 'workouts' ? 'fitness_center' : 'fastfood' }}
          </mat-icon>
        </div>
        <a
          class="flex-row-container flex-justify-content-center flex-align-items-center"
          [routerLink]="getRoute(section?.type)">
          <mat-icon aria-hidden="true">add</mat-icon>
          <span class="margin-left-10">New</span>
        </a>
      </div>

      <div class="flex-column-container flex-justify-content-stretch flex-align-items-stretch margin-bottom-10">
        <span
          class="flex-row-container flex-justify-content-center flex-align-items-center error"
          *ngIf="!list?.length">
          nothing here to assign
        </span>
        <button
          type="button"
          *ngFor="let item of list"
          class="assign-item flex-row-container flex-justify-content-stretch flex-align-items-center padding-10 margin-bottom-10 cursor-pointer"
          [class.active]="exists(item)"
          [attr.aria-pressed]="exists(item)"
          (click)="toggleItem(item)">
          <mat-icon aria-hidden="true">playlist_add</mat-icon>
          <span class="margin-left-10">{{ item.name }}</span>
        </button>
      </div>

      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">
        <button
          mat-button
          type="button"
          [disabled]="pending"
          (click)="updateAssign()">
          <mat-icon color="primary" aria-hidden="true">update</mat-icon>
          <span class="padding-left-10">Update</span>
        </button>
        <button
          mat-button
          type="button"
          (click)="cancelAssign()">
          <mat-icon color="warn" aria-hidden="true">cancel</mat-icon>
          <span class="padding-left-10">Cancel</span>
        </button>
      </div>

    </div>

  </div>
  `
})
export class ScheduleAssignComponent implements OnInit {

  @Input() section: ScheduleSectionEvent | null | undefined = null;
  @Input() list: (Meal | Workout)[] | null | undefined = null;
  @Input()
  set pending(value: boolean) {
    this.pendingValue = value;
    if (!value) {
      this.emitting = false;
    }
  }
  get pending(): boolean {
    return this.pendingValue;
  }

  @Output() updatingItems = new EventEmitter<Record<string, string[]>>();
  @Output() closingAssign = new EventEmitter<void>();

  private selected: string [] = [];
  private pendingValue = false;
  private emitting = false;

  // constructor() {}

  ngOnInit(): void {
    this.selected = [...(this.section?.assigned ?? [])];
  }

  toggleItem(item: Meal | Workout): void {
    if (this.exists(item)) {
      this.selected = this.selected.filter(value => value !== item.$key && value !== item.name);
      return;
    }
    this.selected = [...this.selected.filter(value => value !== item.name), item.$key];
  }

  getRoute(name: string | undefined): string[] {
    return [`../${name}/new`];
  }

  exists(item: Meal | Workout): boolean {
    return this.selected.includes(item.$key) || this.selected.includes(item.name);
  }

  updateAssign(): void {
    if (!this.section || this.pending || this.emitting) {
      return;
    }
    this.emitting = true;
    this.updatingItems.emit({
      [this.section.type]: this.selected.map(value => this.idFor(value))
    });
  }

  private idFor(value: string): string {
    const match = this.list?.find(item => item.$key === value || item.name === value);
    return match?.$key ?? value;
  }

  cancelAssign(): void {
    this.closingAssign.emit();
  }

}
