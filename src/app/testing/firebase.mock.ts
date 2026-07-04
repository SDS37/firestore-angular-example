import { Auth, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

export const mockFirebaseUser = {
  uid: 'test-user-id',
  email: 'test@example.com'
} as User;

export const mockAuth = {
  currentUser: mockFirebaseUser
} as Auth;

export const mockAuthWithoutUser = {
  currentUser: null
} as Auth;

export const mockFirestore = {} as Firestore;
