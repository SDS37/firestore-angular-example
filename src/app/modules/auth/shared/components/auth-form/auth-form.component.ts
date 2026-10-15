import { Component, output, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'auth-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <form class="flex-column-container padding-20 margin-10 border-solid-1 min-width-258" [formGroup]="form" (ngSubmit)="onSubmit()">

      <ng-content select="h1"></ng-content>

      <mat-form-field class="margin-bottom-10">
        <mat-label>Email address</mat-label>
        <input matInput type="email" formControlName="email">
        @if (emailRequired) {
<mat-error>
          Email address is <strong>required</strong>
        </mat-error>
}
        @if (emailFormat) {
<mat-error>
          Enter a valid email address
        </mat-error>
}
      </mat-form-field>

      <mat-form-field class="margin-bottom-10">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password">
        @if (passwordRequired) {
<mat-error>
          Password is <strong>required</strong>
        </mat-error>
}
        @if (passwordTooShort) {
<mat-error>
          Use at least 6 characters
        </mat-error>
}
      </mat-form-field>

      <ng-content select=".error"></ng-content>
      <ng-content select=".notice"></ng-content>
      <ng-content select=".auth-reset"></ng-content>

      <div class="flex-row-container flex-justify-content-space-between flex-align-items-center">
        <ng-content select="a"></ng-content>
        <ng-content select="button"></ng-content>
      </div>

    </form>
    `
  })

export class AuthFormComponent {
  private fb = inject(FormBuilder);


  readonly submitted = output<FormGroup>();

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form);
  }

  get emailRequired(): boolean {
    return this.touchedError('email', 'required');
  }

  get emailFormat(): boolean {
    return this.touchedError('email', 'email');
  }

  get passwordRequired(): boolean {
    return this.touchedError('password', 'required');
  }

  get passwordTooShort(): boolean {
    const control = this.form.get('password');
    return !!control
      && control.hasError('minlength')
      && !control.hasError('required')
      && control.touched;
  }

  private touchedError(controlName: 'email' | 'password', error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.hasError(error) && control.touched;
  }

}
