import { TestBed } from '@angular/core/testing';
import { firstValueFrom, Subject } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { Store } from 'src/app/store/store';
import { installFirebaseTestMocks } from 'src/app/testing/firebase-test-harness';
import { mockAuth, mockFirebaseUser } from 'src/app/testing/firebase.mock';

describe('AuthService', () => {
  let service: AuthService;
  let store: Store;
  let mocks: ReturnType<typeof installFirebaseTestMocks>;

  beforeEach(() => {
    mocks = installFirebaseTestMocks(mockFirebaseUser);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        Store,
        { provide: Auth, useValue: mockAuth }
      ]
    });

    service = TestBed.inject(AuthService);
    store = TestBed.inject(Store);
  });

  it('should sync authenticated users into the store', async () => {
    await firstValueFrom(service.auth$);

    expect(store.value.user).toEqual({
      email: mockFirebaseUser.email,
      uid: mockFirebaseUser.uid,
      authenticated: true
    });
  });

  it('should expose the current firebase user', () => {
    expect(service.user).toBe(mockFirebaseUser);
  });

  it('should delegate login to firebase auth', async () => {
    await service.loginUser('test@example.com', 'secret');

    expect(mocks.signInUser).toHaveBeenCalledWith(
      mockAuth,
      'test@example.com',
      'secret'
    );
  });

  it('should delegate registration to firebase auth', async () => {
    await service.createUser('test@example.com', 'secret');

    expect(mocks.registerUser).toHaveBeenCalledWith(
      mockAuth,
      'test@example.com',
      'secret'
    );
  });

  it('should reset every store key when auth becomes empty', () => {
    const authState = new Subject<typeof mockFirebaseUser | null>();
    TestBed.resetTestingModule();
    const signedOutMocks = installFirebaseTestMocks(null);
    signedOutMocks.observeAuthState.mockReturnValue(authState);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        Store,
        { provide: Auth, useValue: mockAuth }
      ]
    });

    const signedOutStore = TestBed.inject(Store);
    const signedOutService = TestBed.inject(AuthService);
    signedOutStore.set('meals', []);
    signedOutStore.set('schedule', {});
    signedOutService.auth$.subscribe();

    authState.next(mockFirebaseUser);
    expect(signedOutStore.value.user?.uid).toBe(mockFirebaseUser.uid);

    authState.next(null);
    expect(signedOutStore.value.user).toBeNull();
    expect(signedOutStore.value.meals).toBeUndefined();
    expect(signedOutStore.value.schedule).toBeUndefined();
  });

  it('should delegate logout to firebase auth', async () => {
    await service.logoutUser();

    expect(mocks.signOutUser).toHaveBeenCalledWith(mockAuth);
  });

  it('should request a password reset email', async () => {
    await service.sendPasswordReset('test@example.com');

    expect(mocks.sendPasswordReset).toHaveBeenCalledWith(mockAuth, 'test@example.com');
  });
});
