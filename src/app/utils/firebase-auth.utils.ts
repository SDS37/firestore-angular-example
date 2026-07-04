import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from '@angular/fire/auth';
import { onAuthStateChanged as firebaseOnAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';

export const firebaseAuthApi = {
  observeAuthState(auth: Auth): Observable<User | null> {
    return authState(auth);
  },

  onAuthStateChanged(
    auth: Auth,
    next: (user: User | null) => void,
    error?: (error: Error) => void,
    completed?: () => void
  ): () => void {
    return firebaseOnAuthStateChanged(auth, next, error, completed);
  },

  signInUser(auth: Auth, email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  registerUser(auth: Auth, email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  signOutUser(auth: Auth) {
    return signOut(auth);
  }
};

export function observeAuthState(auth: Auth): Observable<User | null> {
  return firebaseAuthApi.observeAuthState(auth);
}

export function onAuthStateChanged(
  auth: Auth,
  next: (user: User | null) => void,
  error?: (error: Error) => void,
  completed?: () => void
): () => void {
  return firebaseAuthApi.onAuthStateChanged(auth, next, error, completed);
}

export function signInUser(auth: Auth, email: string, password: string) {
  return firebaseAuthApi.signInUser(auth, email, password);
}

export function registerUser(auth: Auth, email: string, password: string) {
  return firebaseAuthApi.registerUser(auth, email, password);
}

export function signOutUser(auth: Auth) {
  return firebaseAuthApi.signOutUser(auth);
}
