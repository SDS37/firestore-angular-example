import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthFormComponent } from 'src/app/modules/auth/shared/components/auth-form/auth-form.component';
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['loginUser']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, LoginComponent, AuthFormComponent, ...MATERIAL_IMPORTS],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should navigate home after a successful login', async () => {
    authService.loginUser.and.returnValue(Promise.resolve({} as never));

    await component.loginUser({
      value: { email: 'test@example.com', password: 'secret' }
    } as never);

    expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'secret');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should expose login errors', async () => {
    authService.loginUser.and.returnValue(Promise.reject(new Error('Invalid credentials')));

    await component.loginUser({
      value: { email: 'test@example.com', password: 'wrong' }
    } as never);

    expect(component.error).toBe('Invalid credentials');
  });
});
