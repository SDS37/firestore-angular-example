import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div
    id="navbar"
    class="
      flex-row-container
      flex-justify-content-space-between
      flex-align-items-center
      margin-0-auto
      min-height-50
      max-width-600">

    <a
      class="flex-row-container flex-justify-content-center flex-align-items-center border-radius-5"
      routerLink="schedule" routerLinkActive="active-link">
      <mat-icon aria-hidden="false" aria-label="Schedule section">schedule</mat-icon>
      <span class="margin-left-10">Schedule</span>
    </a>
    <a
      class="flex-row-container flex-justify-content-center flex-align-items-center border-radius-5"
      routerLink="meals"
      routerLinkActive="active-link">
      <mat-icon aria-hidden="false" aria-label="Meals section">fastfood</mat-icon>
      <span class="margin-left-10">Meals</span>
    </a>
    <a
      class="flex-row-container flex-justify-content-center flex-align-items-center border-radius-5"
      routerLink="workouts"
      routerLinkActive="active-link">
      <mat-icon aria-hidden="false" aria-label="Meals section">fitness_center</mat-icon>
      <span class="margin-left-10">Workouts</span>
    </a>

  </div>
  `
})

export class AppNavComponent { }
