import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { ScheduleService } from './schedule.service';
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';
import { Store } from 'src/app/store/store';
import { installFirebaseTestMocks } from 'src/app/testing/firebase-test-harness';
import { mockAuth, mockFirebaseUser, mockFirestore } from 'src/app/testing/firebase.mock';
import { ScheduleItem } from 'src/app/models/schedule-item.interface';
import { Meal } from 'src/app/models/meal.interface';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let store: Store;
  let mocks: ReturnType<typeof installFirebaseTestMocks>;

  const scheduleItem: ScheduleItem = {
    meals: ['Omelette'],
    workouts: null,
    section: 'morning',
    timestamp: new Date('2026-07-01T08:00:00').getTime(),
    $key: 'schedule-1'
  };

  beforeEach(() => {
    mocks = installFirebaseTestMocks(mockFirebaseUser);
    mocks.observeCollectionData.and.returnValue(of([scheduleItem]));

    TestBed.configureTestingModule({
      providers: [
        ScheduleService,
        Store,
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: mockFirestore },
        { provide: AuthService, useValue: { user: mockFirebaseUser } }
      ]
    });

    service = TestBed.inject(ScheduleService);
    store = TestBed.inject(Store);
  });

  it('should map schedule documents into a section keyed object', (done) => {
    service.schedule$.subscribe(() => {
      expect(store.value.schedule).toEqual({ morning: scheduleItem });
      done();
    });
  });

  it('should keep the first section when duplicate section keys exist', (done) => {
    const duplicate: ScheduleItem = {
      ...scheduleItem,
      meals: ['Toast'],
      $key: 'schedule-2'
    };

    mocks.observeCollectionData.and.returnValue(of([scheduleItem, duplicate]));

    TestBed.resetTestingModule();
    const duplicateMocks = installFirebaseTestMocks(mockFirebaseUser);
    duplicateMocks.observeCollectionData.and.returnValue(of([scheduleItem, duplicate]));

    TestBed.configureTestingModule({
      providers: [
        ScheduleService,
        Store,
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: mockFirestore },
        { provide: AuthService, useValue: { user: mockFirebaseUser } }
      ]
    });

    const duplicateService = TestBed.inject(ScheduleService);
    const duplicateStore = TestBed.inject(Store);
    duplicateService.schedule$.subscribe(() => {
      expect(duplicateStore.value.schedule.morning.meals).toEqual(['Omelette']);
      done();
    });
  });

  it('should create a new schedule section when assigning without an existing id', (done) => {
    const day = new Date('2026-07-02T12:00:00');

    service.items$.subscribe(() => {
      expect(mocks.createDocument).toHaveBeenCalled();
      const payload = mocks.createDocument.calls.mostRecent().args[1] as ScheduleItem;
      expect(payload.section).toBe('lunch');
      expect(payload.meals).toEqual(['Salad']);
      expect(payload.timestamp).toBe(new Date(day).getTime());
      done();
    });

    service.selectSection({
      type: 'meals',
      assigned: ['Salad'],
      data: {} as ScheduleItem,
      section: 'lunch',
      day
    });
    service.updateItems({ meals: ['Salad'] });
  });

  it('should update an existing schedule section when an id is present', (done) => {
    service.items$.subscribe(() => {
      expect(mocks.updateDocument).toHaveBeenCalled();
      done();
    });

    service.selectSection({
      type: 'meals',
      assigned: ['Omelette', 'Toast'],
      data: scheduleItem,
      section: 'morning',
      day: new Date(scheduleItem.timestamp)
    });
    service.updateItems({ meals: ['Omelette', 'Toast'] });
  });

  it('should expose meals or workouts for the selected section type', (done) => {
    const meals: Meal[] = [{
      name: 'Soup',
      ingredients: ['water'],
      timestamp: 1,
      $key: 'meal-1',
      $exists: () => true
    }];
    store.set('meals', meals);

    service.list$.subscribe(value => {
      expect(value).toEqual(meals);
      done();
    });

    service.selectSection({
      type: 'meals',
      assigned: [],
      data: {} as ScheduleItem,
      section: 'evening',
      day: new Date()
    });
  });
});
