import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

// interfaces
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div
    id="app-header"
    class="
      flex-row-container
      flex-justify-content-space-between
      flex-align-items-center
      margin-0-auto
      padding-left-10
      padding-right-10
      min-height-50
      max-width-900
      border-radius-5
      background-color-gray-1">
    <div id="user-name">{{ user.email }}</div>
    <button
      mat-button
      (click)="logoutUser()">
      <mat-icon color="warn" aria-hidden="false" aria-label="Logout">power_settings_new</mat-icon>
      <span class="padding-left-10">Logout</span>
    </button>
  </div>
  `
})
export class AppHeaderComponent {

  @Input() user: User;
  @Output() logout = new EventEmitter<any>();

  logoutUser(): void {
    this.logout.emit();
  }

}
