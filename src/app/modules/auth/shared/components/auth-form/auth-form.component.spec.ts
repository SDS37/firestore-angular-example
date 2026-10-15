import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthFormComponent } from './auth-form.component';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AuthFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not emit invalid submissions', () => {
    vi.spyOn(component.submitted, 'emit');
    component.onSubmit();
    expect(component.submitted.emit).not.toHaveBeenCalled();
    expect(component.form.get('email')?.touched).toBe(true);
    expect(component.form.get('password')?.touched).toBe(true);
  });

  it('should reject a password shorter than 6 characters', () => {
    vi.spyOn(component.submitted, 'emit');
    component.form.setValue({
      email: 'test@example.com',
      password: 'short'
    });

    component.onSubmit();

    expect(component.submitted.emit).not.toHaveBeenCalled();
    expect(component.passwordTooShort).toBe(true);
  });

  it('should emit the form when valid', () => {
    vi.spyOn(component.submitted, 'emit');
    component.form.setValue({
      email: 'test@example.com',
      password: 'secret'
    });

    component.onSubmit();

    expect(component.submitted.emit).toHaveBeenCalledWith(component.form);
  });
});
