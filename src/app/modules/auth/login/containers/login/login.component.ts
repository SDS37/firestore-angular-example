import { Component } from '@angular/core';
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
    <a routerLink="/auth/register">Not registered ?</a>
    <button mat-raised-button color="primary" type="submit">login</button>
  </auth-form>
  `
})

export class LoginComponent {

  error: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
