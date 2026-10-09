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

  it('should expose workouts navigation with the correct aria label', () => {
    const workoutsLink = fixture.nativeElement.querySelector('a[routerLink="/workouts"] mat-icon');
    expect(workoutsLink.getAttribute('aria-label')).toBe('Workouts section');
  });
});
