import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthFormComponent } from 'src/app/modules/auth/shared/components/auth-form/auth-form.component';
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';
import { MaterialModule } from 'src/app/modules/shared/material/material.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['loginUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule],
      declarations: [LoginComponent, AuthFormComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

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
