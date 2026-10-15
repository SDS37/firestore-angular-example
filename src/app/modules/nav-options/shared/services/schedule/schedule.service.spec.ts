import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { firstValueFrom, of } from 'rxjs';
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
    mocks.observeCollectionData.mockReturnValue(of([scheduleItem]));

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

  it('should map schedule documents into a section keyed object', async () => {
    await firstValueFrom(service.schedule$);
    expect(store.value.schedule).toEqual({ morning: scheduleItem });
  });

  it('should keep the first section when duplicate section keys exist', async () => {
    const duplicate: ScheduleItem = {
      ...scheduleItem,
      meals: ['Toast'],
      $key: 'schedule-2'
    };

    mocks.observeCollectionData.mockReturnValue(of([scheduleItem, duplicate]));

    TestBed.resetTestingModule();
    const duplicateMocks = installFirebaseTestMocks(mockFirebaseUser);
    duplicateMocks.observeCollectionData.mockReturnValue(of([scheduleItem, duplicate]));

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
    await firstValueFrom(duplicateService.schedule$);
    expect(duplicateStore.value.schedule?.morning?.meals).toEqual(['Omelette']);
  });

  it('should create a new schedule section when assigning without an existing id', async () => {
    const day = new Date('2026-07-02T12:00:00');
    service.selectSection({
      type: 'meals',
      assigned: ['Salad'],
      data: {} as ScheduleItem,
      section: 'lunch',
      day
    });
    await service.updateItems({ meals: ['Salad'] });

    expect(mocks.createDocument).toHaveBeenCalled();
    const payload = mocks.createDocument.mock.calls.at(-1)?.[1] as ScheduleItem;
    expect(payload.section).toBe('lunch');
    expect(payload.meals).toEqual(['Salad']);
    expect(payload.timestamp).toBe(new Date(day).getTime());
  });

  it('should update an existing schedule section when an id is present', async () => {
    service.selectSection({
      type: 'meals',
      assigned: ['Omelette', 'Toast'],
      data: scheduleItem,
      section: 'morning',
      day: new Date(scheduleItem.timestamp)
    });
    await service.updateItems({ meals: ['Omelette', 'Toast'] });

    expect(mocks.updateDocument).toHaveBeenCalled();
  });

  it('should remove a deleted meal id and its legacy name from schedule sections', async () => {
    mocks.observeCollectionData.mockReturnValue(of([{
      ...scheduleItem,
      meals: ['meal-1', 'Omelette', 'Toast'],
      $key: 'schedule-1'
    }]));

    await service.removeReferences('meals', 'meal-1', 'Omelette');

    expect(mocks.updateDocument).toHaveBeenCalled();
    const payload = mocks.updateDocument.mock.calls.at(-1)?.[1] as ScheduleItem;
    expect(payload.meals).toEqual(['Toast']);
    expect(payload.$key).toBeUndefined();
  });

  it('should expose meals or workouts for the selected section type', async () => {
    const meals: Meal[] = [{
      name: 'Soup',
      ingredients: ['water'],
      timestamp: 1,
      $key: 'meal-1',
      $exists: () => true
    }];
    store.set('meals', meals);
    const pending = firstValueFrom(service.list$);

    service.selectSection({
      type: 'meals',
      assigned: [],
      data: {} as ScheduleItem,
      section: 'evening',
      day: new Date()
    });

    await expect(pending).resolves.toEqual(meals);
  });
});
