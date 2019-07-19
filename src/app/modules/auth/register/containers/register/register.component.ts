import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// services
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'register',
  template: `
  <auth-form (submitted)="registerUser($event)">
    <h1>register</h1>
    <div class="error" *ngIf="error">
      {{ error }}
    </div>
    <a routerLink="/auth/login">Already have an account ?</a>
    <button mat-raised-button color="primary" type="submit">create account</button>
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
    } catch (error) {
      this.error = error.message;
    }
  }

}
