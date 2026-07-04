import { User } from '@angular/fire/auth';
import { firebaseAuthApi } from 'src/app/utils/firebase-auth.utils';
import { firestoreApi } from 'src/app/utils/firestore.utils';
import { Observable, of } from 'rxjs';
import { mockFirebaseUser } from './firebase.mock';

export interface FirebaseTestMocks {
  observeAuthState: jasmine.Spy<(auth: unknown) => Observable<User | null>>;
  onAuthStateChanged: jasmine.Spy;
  signInUser: jasmine.Spy;
  registerUser: jasmine.Spy;
  signOutUser: jasmine.Spy;
  getCollection: jasmine.Spy;
  observeCollectionData: jasmine.Spy;
  getDocument: jasmine.Spy;
  createDocument: jasmine.Spy;
  updateDocument: jasmine.Spy;
  deleteDocument: jasmine.Spy;
  buildQuery: jasmine.Spy;
  orderByField: jasmine.Spy;
  startAtValue: jasmine.Spy;
  endAtValue: jasmine.Spy;
}

function createMocks(user: User | null): FirebaseTestMocks {
  return {
    observeAuthState: jasmine.createSpy('observeAuthState').and.returnValue(of(user)),
    onAuthStateChanged: jasmine.createSpy('onAuthStateChanged').and.callFake((_auth, next) => {
      (next as (value: User | null) => void)(user);
      return () => undefined;
    }),
    signInUser: jasmine.createSpy('signInUser').and.returnValue(Promise.resolve({ user: mockFirebaseUser })),
    registerUser: jasmine.createSpy('registerUser').and.returnValue(Promise.resolve({ user: mockFirebaseUser })),
    signOutUser: jasmine.createSpy('signOutUser').and.returnValue(Promise.resolve()),
    getCollection: jasmine.createSpy('getCollection').and.callFake((_firestore, path) => ({ path })),
    observeCollectionData: jasmine.createSpy('observeCollectionData').and.returnValue(of([])),
    getDocument: jasmine.createSpy('getDocument').and.callFake((_firestore, path: string) => ({ path })),
    createDocument: jasmine.createSpy('createDocument').and.returnValue(Promise.resolve({ id: 'new-id' })),
    updateDocument: jasmine.createSpy('updateDocument').and.returnValue(Promise.resolve()),
    deleteDocument: jasmine.createSpy('deleteDocument').and.returnValue(Promise.resolve()),
    buildQuery: jasmine.createSpy('buildQuery').and.returnValue({}),
    orderByField: jasmine.createSpy('orderByField').and.returnValue({}),
    startAtValue: jasmine.createSpy('startAtValue').and.returnValue({}),
    endAtValue: jasmine.createSpy('endAtValue').and.returnValue({})
  };
}

function assignApiMocks(mocks: FirebaseTestMocks): void {
  firebaseAuthApi.observeAuthState = mocks.observeAuthState;
  firebaseAuthApi.onAuthStateChanged = mocks.onAuthStateChanged;
  firebaseAuthApi.signInUser = mocks.signInUser;
  firebaseAuthApi.registerUser = mocks.registerUser;
  firebaseAuthApi.signOutUser = mocks.signOutUser;
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
