import { TestBed } from '@angular/core/testing';
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

  it('should sync authenticated users into the store', (done) => {
    service.auth$.subscribe(() => {
      expect(store.value.user).toEqual({
        email: mockFirebaseUser.email,
        uid: mockFirebaseUser.uid,
        authenticated: true
      });
      done();
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

  it('should delegate logout to firebase auth', async () => {
    await service.logoutUser();

    expect(mocks.signOutUser).toHaveBeenCalledWith(mockAuth);
  });
});
