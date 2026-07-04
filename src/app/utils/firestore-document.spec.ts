import { toFirestoreData } from './firestore-document';

describe('toFirestoreData', () => {
  it('should strip AngularFire metadata fields', () => {
    const data = {
      name: 'Breakfast',
      ingredients: ['eggs'],
      $key: 'abc123',
      $exists: () => true
    };

    expect(toFirestoreData(data)).toEqual({
      name: 'Breakfast',
      ingredients: ['eggs']
    });
  });

  it('should return a shallow copy without mutating the source', () => {
    const data = { name: 'Lunch', $key: '1' };
    const result = toFirestoreData(data);

    expect(result).not.toBe(data);
    expect(data.$key).toBe('1');
  });
});
