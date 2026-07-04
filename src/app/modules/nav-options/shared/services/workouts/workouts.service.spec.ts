import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { WorkoutsService } from './workouts.service';
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';
import { Store } from 'src/app/store/store';
import { installFirebaseTestMocks } from 'src/app/testing/firebase-test-harness';
import { mockAuth, mockFirebaseUser, mockFirestore } from 'src/app/testing/firebase.mock';
import { Workout } from 'src/app/models/workout.interface';

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let store: Store;
  let mocks: ReturnType<typeof installFirebaseTestMocks>;

  const workout: Workout = {
    name: 'Bench press',
    type: 'strength',
    strength: { reps: 8, sets: 3, weight: 60 },
    endurance: {},
    timestamp: 0,
    $key: 'workout-1',
    $exists: () => true
  };

  beforeEach(() => {
    mocks = installFirebaseTestMocks(mockFirebaseUser);
    mocks.observeCollectionData.and.returnValue(of([workout]));

    TestBed.configureTestingModule({
      providers: [
        WorkoutsService,
        Store,
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: mockFirestore },
        { provide: AuthService, useValue: { user: mockFirebaseUser } }
      ]
    });

    service = TestBed.inject(WorkoutsService);
    store = TestBed.inject(Store);
  });

  it('should load workouts into the store', (done) => {
    service.workouts$.subscribe(() => {
      expect(store.value.workouts).toEqual([workout]);
      done();
    });
  });

  it('should add workouts without metadata and with a timestamp', async () => {
    await service.addWorkout({
      name: 'Run',
      type: 'endurance',
      strength: {},
      endurance: { distance: 5, duration: 30 },
      timestamp: undefined as unknown as number,
      $key: 'ignored',
      $exists: () => true
    });

    const payload = mocks.createDocument.calls.mostRecent().args[1] as Record<string, unknown>;
    expect(payload.$key).toBeUndefined();
    expect(payload.timestamp).toEqual(jasmine.any(Number));
  });

  it('should return a blank workout template when no id is provided', (done) => {
    service.getWorkout('').subscribe(value => {
      expect(value.type).toBe('strength');
      done();
    });
  });
});
