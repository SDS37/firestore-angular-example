import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthFormComponent } from 'src/app/modules/auth/shared/components/auth-form/auth-form.component';
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';
import { MaterialModule } from 'src/app/modules/shared/material/material.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['createUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule],
      declarations: [RegisterComponent, AuthFormComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

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
