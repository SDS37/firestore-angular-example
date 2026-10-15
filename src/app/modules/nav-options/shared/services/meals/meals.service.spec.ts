import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { firstValueFrom, of, Subject } from 'rxjs';
import { MealsService } from './meals.service';
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';
import { Store } from 'src/app/store/store';
import { installFirebaseTestMocks } from 'src/app/testing/firebase-test-harness';
import { mockAuth, mockFirebaseUser, mockFirestore } from 'src/app/testing/firebase.mock';
import { Meal } from 'src/app/models/meal.interface';

describe('MealsService', () => {
  let service: MealsService;
  let store: Store;
  let mocks: ReturnType<typeof installFirebaseTestMocks>;

  const meal: Meal = {
    name: 'Pancakes',
    ingredients: ['flour', 'milk'],
    timestamp: 0,
    $key: 'meal-1',
    $exists: () => true
  };

  beforeEach(() => {
    mocks = installFirebaseTestMocks(mockFirebaseUser);
    mocks.observeCollectionData.mockReturnValue(of([meal]));

    TestBed.configureTestingModule({
      providers: [
        MealsService,
        Store,
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: mockFirestore },
        { provide: AuthService, useValue: { user: mockFirebaseUser } }
      ]
    });

    service = TestBed.inject(MealsService);
    store = TestBed.inject(Store);
  });

  it('should load meals for the authenticated user into the store', async () => {
    await firstValueFrom(service.meals$);
    expect(store.value.meals).toEqual([meal]);
  });

  it('should query the signed-in user and drop that query on logout', () => {
    const users = new Subject<typeof mockFirebaseUser | null>();
    const secondUser = { ...mockFirebaseUser, uid: 'user-2' };
    TestBed.resetTestingModule();
    const switched = installFirebaseTestMocks(mockFirebaseUser);
    switched.observeAuthState.mockReturnValue(users);
    switched.observeCollectionData.mockReturnValue(of([meal]));
    const paths: string[] = [];
    switched.getCollection.mockImplementation((_firestore: unknown, path: string) => {
      paths.push(path);
      return { path };
    });

    TestBed.configureTestingModule({
      providers: [
        MealsService,
        Store,
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: mockFirestore },
        { provide: AuthService, useValue: { user: mockFirebaseUser } }
      ]
    });

    const subscription = TestBed.inject(MealsService).meals$.subscribe();
    users.next(mockFirebaseUser);
    users.next(null);
    users.next(secondUser);
    subscription.unsubscribe();

    expect(paths).toEqual([
      `users/${mockFirebaseUser.uid}/meals`,
      'users/user-2/meals'
    ]);
  });

  it('should add meals without AngularFire metadata and with a timestamp', async () => {
    await service.addMeal({
      name: 'Toast',
      ingredients: ['bread'],
      timestamp: undefined as unknown as number,
      $key: 'ignored',
      $exists: () => true
    });

    expect(mocks.createDocument).toHaveBeenCalled();
    const payload = mocks.createDocument.mock.calls.at(-1)?.[1] as Record<string, unknown>;
    expect(payload.$key).toBeUndefined();
    expect(payload.$exists).toBeUndefined();
    expect(payload.timestamp).toEqual(expect.any(Number));
  });

  it('should preserve an existing timestamp when updating meals', async () => {
    await service.updateMeal('meal-1', meal);

    expect(mocks.updateDocument).toHaveBeenCalled();
    const payload = mocks.updateDocument.mock.calls.at(-1)?.[1] as Record<string, unknown>;
    expect(payload.name).toBe('Pancakes');
    expect(payload.$key).toBeUndefined();
  });

  it('should delete meals by key', async () => {
    await service.deleteMeal('meal-1');

    expect(mocks.deleteDocument).toHaveBeenCalled();
  });

  it('should return a blank meal template when no id is provided', async () => {
    const value = await firstValueFrom(service.getMeal(''));
    expect(value?.name).toBe('');
    expect(value?.$exists()).toBe(false);
  });

  it('should find a meal from the store by key', async () => {
    store.set('meals', [meal]);

    await expect(firstValueFrom(service.getMeal('meal-1'))).resolves.toEqual(meal);
  });

  it('should throw when uid is requested without authentication', () => {
    TestBed.resetTestingModule();
    installFirebaseTestMocks(null);

    TestBed.configureTestingModule({
      providers: [
        MealsService,
        Store,
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: mockFirestore },
        { provide: AuthService, useValue: { user: null } }
      ]
    });

    const unauthenticatedService = TestBed.inject(MealsService);
    expect(() => unauthenticatedService.uid).toThrow('User not authenticated');
  });
});
