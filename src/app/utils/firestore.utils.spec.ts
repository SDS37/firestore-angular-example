import { firestoreApi } from './firestore.utils';

describe('firestore.utils', () => {
  it('should expose firestore helper functions', () => {
    expect(typeof firestoreApi.getCollection).toBe('function');
    expect(typeof firestoreApi.observeCollectionData).toBe('function');
    expect(typeof firestoreApi.createDocument).toBe('function');
    expect(typeof firestoreApi.updateDocument).toBe('function');
    expect(typeof firestoreApi.deleteDocument).toBe('function');
    expect(typeof firestoreApi.buildQuery).toBe('function');
  });
});
