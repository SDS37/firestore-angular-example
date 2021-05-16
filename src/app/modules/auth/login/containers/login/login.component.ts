import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

@Component({
  selector: 'login',
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
    } catch (error) {
      this.error = error.message;
    }
  }

}
