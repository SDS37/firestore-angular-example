import { EnvironmentInjector, Injectable, inject, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, DocumentReference } from '@angular/fire/firestore';

// store
import { Store } from 'src/app/store/store';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';
import { ScheduleService } from 'src/app/modules/nav-options/shared/services/schedule/schedule.service';

// utils
import { toFirestoreData } from 'src/app/utils/firestore-document';
import { observeAuthState } from 'src/app/utils/firebase-auth.utils';
import { ScheduleCleanupError } from 'src/app/utils/schedule-cleanup-error';
import {
  getCollection,
  observeCollectionData,
  observeInInjectionContext,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument
} from 'src/app/utils/firestore.utils';

// rxjs
import { EMPTY, Observable, of } from 'rxjs';
import { tap, map, filter, shareReplay, switchMap } from 'rxjs/operators';

// interfaces
import { Workout } from 'src/app/models/workout.interface';

@Injectable({ providedIn: 'root' })
export class WorkoutsService {

  private readonly environmentInjector = inject(EnvironmentInjector);

  workouts$: Observable<Workout[]> = observeAuthState(this.auth).pipe(
    switchMap(user => {
      if (!user) {
        return EMPTY;
      }
      return observeInInjectionContext(this.environmentInjector, () => {
        const workoutsCollection = getCollection(this.firestore, `users/${user.uid}/workouts`);
        return observeCollectionData<Workout>(workoutsCollection, { idField: '$key' });
      });
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
    tap((next: Workout[]): void => {
      this.store.set('workouts', next);
    })
  );

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private store: Store,
    private authService: AuthService,
    private scheduleService: ScheduleService
  ) {}

  get uid(): string {
    const user = this.authService.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  addWorkout(workout: Workout): Promise<DocumentReference> {
    return runInInjectionContext(this.environmentInjector, () => {
      const workoutsCollection = getCollection(this.firestore, `users/${this.uid}/workouts`);
      return createDocument(workoutsCollection, toFirestoreData({
        ...workout,
        timestamp: workout.timestamp ?? Date.now()
      }));
    });
  }

  updateWorkout(key: string, workout: Workout): Promise<void> {
    return runInInjectionContext(this.environmentInjector, () => {
      const workoutDoc = getDocument(this.firestore, `users/${this.uid}/workouts/${key}`);
      return updateDocument(workoutDoc, toFirestoreData(workout));
    });
  }

  async deleteWorkout(key: string): Promise<void> {
    const name = this.store.value.workouts?.find(workout => workout.$key === key)?.name;
    await runInInjectionContext(this.environmentInjector, () => {
      const workoutDoc = getDocument(this.firestore, `users/${this.uid}/workouts/${key}`);
      return deleteDocument(workoutDoc);
    });
    try {
      await this.scheduleService.removeReferences('workouts', key, name);
    } catch {
      throw new ScheduleCleanupError('workout');
    }
  }

  getWorkout(paramskey: string): Observable<Workout | undefined> {
    if (!paramskey) {
      return of({
        name: '',
        type: 'strength',
        strength: {},
        endurance: {},
        timestamp: null,
        $key: '',
        $exists: () => false
      });
    }
    return this.store.select('workouts').pipe(
      filter(Boolean),
      map((workouts: Workout[]) => workouts.find((workout: Workout) => workout.$key === paramskey))
    );
  }

}
