import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { AuthFormComponent } from 'src/app/modules/auth/shared/components/auth-form/auth-form.component';
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['createUser']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, RegisterComponent, AuthFormComponent, ...MATERIAL_IMPORTS],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component = TestBed.createComponent(RegisterComponent).componentInstance;
  });

  it('should navigate home after successful registration', async () => {
    authService.createUser.and.returnValue(Promise.resolve({} as never));

    await component.registerUser({
      value: { email: 'test@example.com', password: 'secret' }
    } as never);

    expect(authService.createUser).toHaveBeenCalledWith('test@example.com', 'secret');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should expose registration errors', async () => {
    authService.createUser.and.returnValue(Promise.reject(new Error('Email already in use')));

    await component.registerUser({
      value: { email: 'test@example.com', password: 'secret' }
    } as never);

    expect(component.error).toBe('Email already in use');
  });
});
