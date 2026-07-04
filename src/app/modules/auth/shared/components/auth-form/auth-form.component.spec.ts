import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthFormComponent } from './auth-form.component';
import { MaterialModule } from 'src/app/modules/shared/material/material.module';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule],
      declarations: [AuthFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not emit invalid submissions', () => {
    spyOn(component.submitted, 'emit');
    component.onSubmit();
    expect(component.submitted.emit).not.toHaveBeenCalled();
  });

  it('should emit the form when valid', () => {
    spyOn(component.submitted, 'emit');
    component.form.setValue({
      email: 'test@example.com',
      password: 'secret'
    });

    component.onSubmit();

    expect(component.submitted.emit).toHaveBeenCalledWith(component.form);
  });
});
