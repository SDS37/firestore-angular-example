import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  startAt,
  endAt,
  DocumentReference,
  Query,
  QueryConstraint,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export const firestoreApi = {
  getCollection(firestore: Firestore, path: string): CollectionReference<DocumentData> {
    return collection(firestore, path);
  },

  observeCollectionData<T>(
    reference: CollectionReference<DocumentData> | Query<DocumentData>,
    options?: { idField?: string }
  ): Observable<T[]> {
    return collectionData(reference, options) as Observable<T[]>;
  },

  getDocument(firestore: Firestore, path: string) {
    return doc(firestore, path);
  },

  createDocument(
    reference: CollectionReference<DocumentData>,
    data: Record<string, unknown>
  ): Promise<DocumentReference<DocumentData>> {
    return addDoc(reference, data);
  },

  updateDocument(
    reference: ReturnType<typeof doc>,
    data: Record<string, unknown>
  ): Promise<void> {
    return updateDoc(reference, data);
  },

  deleteDocument(reference: ReturnType<typeof doc>): Promise<void> {
    return deleteDoc(reference);
  },

  buildQuery(
    reference: CollectionReference<DocumentData>,
    ...constraints: QueryConstraint[]
  ) {
    return query(reference, ...constraints);
  },

  orderByField(field: string) {
    return orderBy(field);
  },

  startAtValue(value: number) {
    return startAt(value);
  },

  endAtValue(value: number) {
    return endAt(value);
  }
};

export function getCollection(firestore: Firestore, path: string) {
  return firestoreApi.getCollection(firestore, path);
}

export function observeCollectionData<T>(
  reference: CollectionReference<DocumentData> | Query<DocumentData>,
  options?: { idField?: string }
): Observable<T[]> {
  return firestoreApi.observeCollectionData<T>(reference, options);
}

export function getDocument(firestore: Firestore, path: string) {
  return firestoreApi.getDocument(firestore, path);
}

export function createDocument(
  reference: CollectionReference<DocumentData>,
  data: Record<string, unknown>
) {
  return firestoreApi.createDocument(reference, data);
}

export function updateDocument(
  reference: ReturnType<typeof doc>,
  data: Record<string, unknown>
) {
  return firestoreApi.updateDocument(reference, data);
}

export function deleteDocument(reference: ReturnType<typeof doc>) {
  return firestoreApi.deleteDocument(reference);
}

export function buildQuery(
  reference: CollectionReference<DocumentData>,
  ...constraints: QueryConstraint[]
) {
  return firestoreApi.buildQuery(reference, ...constraints);
}

export function orderByField(field: string) {
  return firestoreApi.orderByField(field);
}

export function startAtValue(value: number) {
  return firestoreApi.startAtValue(value);
}

export function endAtValue(value: number) {
  return firestoreApi.endAtValue(value);
}
