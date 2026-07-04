import { firebaseAuthApi } from './firebase-auth.utils';

describe('firebase-auth.utils', () => {
  it('should expose auth helper functions', () => {
    expect(typeof firebaseAuthApi.observeAuthState).toBe('function');
    expect(typeof firebaseAuthApi.onAuthStateChanged).toBe('function');
    expect(typeof firebaseAuthApi.signInUser).toBe('function');
    expect(typeof firebaseAuthApi.registerUser).toBe('function');
    expect(typeof firebaseAuthApi.signOutUser).toBe('function');
  });
});
