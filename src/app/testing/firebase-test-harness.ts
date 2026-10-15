import { User } from '@angular/fire/auth';
import { Mock, vi } from 'vitest';
import { firebaseAuthApi } from 'src/app/utils/firebase-auth.utils';
import { firestoreApi } from 'src/app/utils/firestore.utils';
import { Observable, of } from 'rxjs';
import { mockFirebaseUser } from './firebase.mock';

export interface FirebaseTestMocks {
  observeAuthState: Mock<(auth: unknown) => Observable<User | null>>;
  onAuthStateChanged: Mock;
  signInUser: Mock;
  registerUser: Mock;
  signOutUser: Mock;
  sendPasswordReset: Mock;
  getCollection: Mock;
  observeCollectionData: Mock;
  getDocument: Mock;
  createDocument: Mock;
  updateDocument: Mock;
  deleteDocument: Mock;
  buildQuery: Mock;
  orderByField: Mock;
  startAtValue: Mock;
  endAtValue: Mock;
}

function createMocks(user: User | null): FirebaseTestMocks {
  return {
    observeAuthState: vi.fn<(auth: unknown) => Observable<User | null>>().mockReturnValue(of(user)),
    onAuthStateChanged: vi.fn().mockImplementation((_auth: unknown, next: (value: User | null) => void) => {
      next(user);
      return () => undefined;
    }),
    signInUser: vi.fn().mockResolvedValue({ user: mockFirebaseUser }),
    registerUser: vi.fn().mockResolvedValue({ user: mockFirebaseUser }),
    signOutUser: vi.fn().mockResolvedValue(undefined),
    sendPasswordReset: vi.fn().mockResolvedValue(undefined),
    getCollection: vi.fn().mockImplementation((_firestore: unknown, path: string) => ({ path })),
    observeCollectionData: vi.fn().mockReturnValue(of([])),
    getDocument: vi.fn().mockImplementation((_firestore: unknown, path: string) => ({ path })),
    createDocument: vi.fn().mockResolvedValue({ id: 'new-id' }),
    updateDocument: vi.fn().mockResolvedValue(undefined),
    deleteDocument: vi.fn().mockResolvedValue(undefined),
    buildQuery: vi.fn().mockReturnValue({}),
    orderByField: vi.fn().mockReturnValue({}),
    startAtValue: vi.fn().mockReturnValue({}),
    endAtValue: vi.fn().mockReturnValue({})
  };
}

function assignApiMocks(mocks: FirebaseTestMocks): void {
  firebaseAuthApi.observeAuthState = mocks.observeAuthState;
  firebaseAuthApi.onAuthStateChanged = mocks.onAuthStateChanged;
  firebaseAuthApi.signInUser = mocks.signInUser;
  firebaseAuthApi.registerUser = mocks.registerUser;
  firebaseAuthApi.signOutUser = mocks.signOutUser;
  firebaseAuthApi.sendPasswordReset = mocks.sendPasswordReset;
  firestoreApi.getCollection = mocks.getCollection;
  firestoreApi.observeCollectionData = mocks.observeCollectionData;
  firestoreApi.getDocument = mocks.getDocument;
  firestoreApi.createDocument = mocks.createDocument;
  firestoreApi.updateDocument = mocks.updateDocument;
  firestoreApi.deleteDocument = mocks.deleteDocument;
  firestoreApi.buildQuery = mocks.buildQuery;
  firestoreApi.orderByField = mocks.orderByField;
  firestoreApi.startAtValue = mocks.startAtValue;
  firestoreApi.endAtValue = mocks.endAtValue;
}

export function installFirebaseTestMocks(user: User | null = mockFirebaseUser): FirebaseTestMocks {
  const mocks = createMocks(user);
  assignApiMocks(mocks);
  return mocks;
}
