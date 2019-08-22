import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'auth-form',
  template: `
    <form class="flex-column-container padding-20 margin-10 border-solid-1 min-width-258" [formGroup]="form" (ngSubmit)="onSubmit()">

      <ng-content select="h1"></ng-content>

      <mat-form-field class="margin-bottom-10">
        <input matInput type="email" placeholder="Email address" formControlName="email">
        <mat-error *ngIf="emailFormat">
        invalid email format
        </mat-error>
      </mat-form-field>

      <mat-form-field class="margin-bottom-10">
        <input matInput type="password" placeholder="password" formControlName="password">
        <mat-error *ngIf="passwordInvalid">
        Password <strong>required</strong>
        </mat-error>
      </mat-form-field>

      <ng-content select=".error"></ng-content>

      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">
        <ng-content select="a"></ng-content>
        <ng-content select="button"></ng-content>
      </div>

    </form>
    `
  })

export class AuthFormComponent {

  @Output() submitted = new EventEmitter<FormGroup>();

  form = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form);
    }
  }

  get passwordInvalid(): boolean {
    const control = this.form.get('password');
    return control.hasError('required') && control.touched;
  }

  get emailFormat(): boolean {
    const control = this.form.get('email');
    return control.hasError('email') && control.touched;
  }

}
