import { Store } from './store';
import { Meal } from '../models/meal.interface';

describe('Store', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  it('should expose default undefined slices', () => {
    expect(store.value.user).toBeUndefined();
    expect(store.value.meals).toBeUndefined();
  });

  it('should set and select state slices', (done) => {
    const meals: Meal[] = [{
      name: 'Omelette',
      ingredients: ['eggs'],
      timestamp: 1,
      $key: 'meal-1',
      $exists: () => true
    }];

    store.set('meals', meals);

    store.select<Meal[]>('meals').subscribe(value => {
      expect(value).toEqual(meals);
      done();
    });
  });

  it('should merge updates without dropping other slices', () => {
    store.set('user', { email: 'a@b.com', uid: '1', authenticated: true });
    store.set('meals', []);

    expect(store.value.user?.email).toBe('a@b.com');
    expect(store.value.meals).toEqual([]);
  });
});
