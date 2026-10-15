import { firstValueFrom } from 'rxjs';
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

  it('should set and select state slices', async () => {
    const meals: Meal[] = [{
      name: 'Omelette',
      ingredients: ['eggs'],
      timestamp: 1,
      $key: 'meal-1',
      $exists: () => true
    }];

    store.set('meals', meals);

    await expect(firstValueFrom(store.select('meals'))).resolves.toEqual(meals);
  });

  it('should reset every slice and leave the user signed out', () => {
    store.set('user', { email: 'a@b.com', uid: '1', authenticated: true });
    store.set('meals', []);
    store.set('workouts', []);
    store.set('date', new Date('2026-07-01T00:00:00'));
    store.set('schedule', { morning: { meals: ['Omelette'], workouts: null, section: 'morning', timestamp: 1 } });
    store.set('selected', {
      type: 'meals',
      assigned: ['Omelette'],
      data: { meals: ['Omelette'], workouts: null, section: 'morning', timestamp: 1 },
      section: 'morning',
      day: new Date('2026-07-01T00:00:00')
    });
    store.set('list', []);

    store.reset();

    expect(store.value).toEqual({
      user: null,
      meals: undefined,
      workouts: undefined,
      date: undefined,
      schedule: undefined,
      selected: undefined,
      list: undefined
    });
  });

  it('should merge updates without dropping other slices', () => {
    store.set('user', { email: 'a@b.com', uid: '1', authenticated: true });
    store.set('meals', []);

    expect(store.value.user?.email).toBe('a@b.com');
    expect(store.value.meals).toEqual([]);
  });
});
