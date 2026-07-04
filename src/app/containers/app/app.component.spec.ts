import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';
import { Store } from 'src/app/store/store';

describe('AppComponent', () => {
  let routerEvents$: Subject<NavigationEnd>;
  let logoutSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    routerEvents$ = new Subject<NavigationEnd>();
    logoutSpy = jasmine.createSpy('logoutUser').and.returnValue(Promise.resolve());
    navigateSpy = jasmine.createSpy('navigate');

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        Store,
        {
          provide: AuthService,
          useValue: {
            auth$: of(null),
            logoutUser: logoutSpy
          }
        },
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable(),
            navigate: navigateSpy
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should mark auth routes when navigating to login or register', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    routerEvents$.next(new NavigationEnd(1, '/auth/login', '/auth/login'));
    expect(fixture.componentInstance.isAuthUrl).toBeTrue();

    routerEvents$.next(new NavigationEnd(2, '/schedule', '/schedule'));
    expect(fixture.componentInstance.isAuthUrl).toBeFalse();
  });

  it('should logout and navigate to login', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.componentInstance.onLogout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});
