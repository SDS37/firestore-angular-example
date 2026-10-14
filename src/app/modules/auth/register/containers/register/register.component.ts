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
  selector: 'register',
  imports: [AuthFormComponent, RouterLink, MatButtonModule, NgIf],
  template: `
  <auth-form (submitted)="registerUser($event)">
    <h1>register</h1>
    <div class="error" *ngIf="error">
      {{ error }}
    </div>
    <a routerLink="/auth/login">Already have an account ?</a>
    <button mat-raised-button color="primary" type="submit">register</button>
  </auth-form>
  `
})

export class RegisterComponent {

  error: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async registerUser(event: FormGroup): Promise<void> {
    const { email, password } = event.value;
    try {
      await this.authService.createUser(email, password);
      this.router.navigate(['/']);
    } catch (error: unknown) {
      this.error = error instanceof Error ? error.message : 'Registration failed';
    }
  }

}
