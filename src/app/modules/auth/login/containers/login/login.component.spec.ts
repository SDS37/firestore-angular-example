import { Mock, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthFormComponent } from 'src/app/modules/auth/shared/components/auth-form/auth-form.component';
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: { loginUser: Mock };
  let router: Router;

  beforeEach(async () => {
    authService = { loginUser: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, LoginComponent, AuthFormComponent],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should navigate home after a successful login', async () => {
    authService.loginUser.mockReturnValue(Promise.resolve({} as never));

    await component.loginUser({
      value: { email: 'test@example.com', password: 'secret' }
    } as never);

    expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'secret');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should expose login errors', async () => {
    authService.loginUser.mockReturnValue(Promise.reject(new Error('Invalid credentials')));

    await component.loginUser({
      value: { email: 'test@example.com', password: 'wrong' }
    } as never);

    expect(component.error).toBe('Invalid credentials');
  });
});
