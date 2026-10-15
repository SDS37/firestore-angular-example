import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'login',
  imports: [AuthFormComponent, RouterLink, MatButtonModule, NgIf],
  template: `
  <auth-form (submitted)="loginUser($event)">
    <h1>login</h1>
    <div class="error" *ngIf="error">
      {{ error }}
    </div>
    <div class="notice" *ngIf="notice">
      {{ notice }}
    </div>
    <a routerLink="/auth/register">Not registered ?</a>
    <button class="auth-reset" mat-button type="button" (click)="sendReset()">Forgot password?</button>
    <button mat-raised-button color="primary" type="submit">login</button>
  </auth-form>
  `
})

export class LoginComponent {

  @ViewChild(AuthFormComponent) private authForm?: AuthFormComponent;

  error = '';
  notice = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  async sendReset(): Promise<void> {
    const email = this.authForm?.form.get('email');
    if (!email || email.invalid) {
      email?.markAsTouched();
      this.showReset('', 'Enter the email address for the account.');
      return;
    }
    this.showReset('', '');
    try {
      await this.authService.sendPasswordReset(String(email.value));
      this.showReset('Check your email for a reset link.', '');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('user-not-found') || message.includes('EMAIL_NOT_FOUND')) {
        this.showReset('Check your email for a reset link.', '');
        return;
      }
      this.showReset('', message || 'Could not send the reset email.');
    }
  }

  private showReset(notice: string, error: string): void {
    this.notice = notice;
    this.error = error;
    this.changeDetector.detectChanges();
  }

  async loginUser(event: FormGroup): Promise<void> {
    // destructuring
    const { email, password } = event.value;
    try {
      // await works as .then(() => {})
      await this.authService.loginUser(email, password);
      this.router.navigate(['/']);
    } catch (error: unknown) {
      this.error = error instanceof Error ? error.message : 'Login failed';
    }
  }

}
