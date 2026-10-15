import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
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
            createUrlTree: vi.fn().mockImplementation(
              (commands: string[]) => ({ commands } as unknown as UrlTree)
            )
          }
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should allow authenticated users', async () => {
    mocks.onAuthStateChanged.mockImplementation((_auth, next) => {
      (next as (value: unknown) => void)(mockFirebaseUser);
      return () => undefined;
    });

    await expect(firstValueFrom(guard.canActivate())).resolves.toBe(true);
  });

  it('should redirect unauthenticated users to login', async () => {
    mocks.onAuthStateChanged.mockImplementation((_auth, next) => {
      (next as (value: unknown) => void)(null);
      return () => undefined;
    });

    const result = await firstValueFrom(guard.canActivate());
    expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
    expect(result).toEqual({ commands: ['/auth/login'] } as unknown as UrlTree);
  });
});
