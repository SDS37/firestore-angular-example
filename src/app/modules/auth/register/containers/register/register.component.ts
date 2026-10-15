import { Component, inject, signal } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

@Component({
  selector: 'register',
  imports: [AuthFormComponent, RouterLink, MatButtonModule],
  template: `
  <auth-form (submitted)="registerUser($event)">
    <h1>register</h1>
    @if (error()) {
      <div class="error">
        {{ error() }}
      </div>
    }
    <a routerLink="/auth/login">Already have an account ?</a>
    <button mat-raised-button color="primary" type="submit">register</button>
  </auth-form>
  `
})

export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);


  readonly error = signal('');

  async registerUser(event: FormGroup): Promise<void> {
    const { email, password } = event.value;
    try {
      await this.authService.createUser(email, password);
      this.router.navigate(['/']);
    } catch (error: unknown) {
      this.error.set(error instanceof Error ? error.message : 'Registration failed');
    }
  }

}
