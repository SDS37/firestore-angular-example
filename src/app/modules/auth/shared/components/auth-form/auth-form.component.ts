import { Component, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'auth-form',
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <form class="flex-column-container padding-20 margin-10 border-solid-1 min-width-258" [formGroup]="form" (ngSubmit)="onSubmit()">

      <ng-content select="h1"></ng-content>

      <mat-form-field class="margin-bottom-10">
        <mat-label>Email address</mat-label>
        <input matInput type="email" formControlName="email">
        <mat-error *ngIf="emailRequired">
          Email address is <strong>required</strong>
        </mat-error>
        <mat-error *ngIf="emailFormat">
          Enter a valid email address
        </mat-error>
      </mat-form-field>

      <mat-form-field class="margin-bottom-10">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password">
        <mat-error *ngIf="passwordRequired">
          Password is <strong>required</strong>
        </mat-error>
        <mat-error *ngIf="passwordTooShort">
          Use at least 6 characters
        </mat-error>
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

  @Output() submitted = new EventEmitter<FormGroup>();

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder
  ) {}

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
