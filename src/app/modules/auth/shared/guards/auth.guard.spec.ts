import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthGuard } from './auth.guard';
import { installFirebaseTestMocks } from 'src/app/testing/firebase-test-harness';
import { mockAuth, mockFirebaseUser } from 'src/app/testing/firebase.mock';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let mocks: ReturnType<typeof installFirebaseTestMocks>;

  beforeEach(() => {
    mocks = installFirebaseTestMocks(mockFirebaseUser);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Auth, useValue: mockAuth },
        {
          provide: Router,
          useValue: {
            createUrlTree: jasmine.createSpy('createUrlTree').and.callFake(
              (commands: string[]) => ({ commands } as unknown as UrlTree)
            )
          }
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should allow authenticated users', (done) => {
    mocks.onAuthStateChanged.and.callFake((_auth, next) => {
      (next as (value: unknown) => void)(mockFirebaseUser);
      return () => undefined;
    });

    guard.canActivate().subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect unauthenticated users to login', (done) => {
    mocks.onAuthStateChanged.and.callFake((_auth, next) => {
      (next as (value: unknown) => void)(null);
      return () => undefined;
    });

    guard.canActivate().subscribe(result => {
      expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
      expect(result).toEqual({ commands: ['/auth/login'] } as unknown as UrlTree);
      done();
    });
  });
});
