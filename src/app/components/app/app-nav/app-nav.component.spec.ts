import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppNavComponent } from './app-nav.component';

describe('AppNavComponent', () => {
  let fixture: ComponentFixture<AppNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppNavComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppNavComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should name the workouts link from its text and hide the icon', () => {
    const workoutsLink = fixture.nativeElement.querySelector('a[routerLink="/workouts"]');
    const icon = workoutsLink.querySelector('mat-icon');
    expect(workoutsLink.textContent).toContain('Workouts');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });
});
