import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, DocumentReference } from '@angular/fire/firestore';

// store
import { Store } from 'src/app/store/store';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

// utils
import { toFirestoreData } from 'src/app/utils/firestore-document';
import { observeAuthState } from 'src/app/utils/firebase-auth.utils';
import {
  getCollection,
  observeCollectionData,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument
} from 'src/app/utils/firestore.utils';

// rxjs
import { Observable, of } from 'rxjs';
import { tap, map, filter, shareReplay, switchMap } from 'rxjs/operators';

// interfaces
import { Workout } from 'src/app/models/workout.interface';

@Injectable({ providedIn: 'root' })
export class WorkoutsService {

  workouts$: Observable<Workout[]> = observeAuthState(this.auth).pipe(
    filter((user): user is NonNullable<typeof user> => !!user),
    switchMap(user => {
      const workoutsCollection = getCollection(this.firestore, `users/${user.uid}/workouts`);
      return observeCollectionData<Workout>(workoutsCollection, { idField: '$key' });
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
    private authService: AuthService
  ) {}

  get uid(): string {
    const user = this.authService.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  addWorkout(workout: Workout): Promise<DocumentReference> {
    const workoutsCollection = getCollection(this.firestore, `users/${this.uid}/workouts`);
    return createDocument(workoutsCollection, toFirestoreData({
      ...workout,
      timestamp: workout.timestamp ?? Date.now()
    }));
  }

  updateWorkout(key: string, workout: Workout): Promise<void> {
    const workoutDoc = getDocument(this.firestore, `users/${this.uid}/workouts/${key}`);
    return updateDocument(workoutDoc, toFirestoreData(workout));
  }

  deleteWorkout(key: string): Promise<void> {
    const workoutDoc = getDocument(this.firestore, `users/${this.uid}/workouts/${key}`);
    return deleteDocument(workoutDoc);
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
    return this.store.select<Workout[]>('workouts').pipe(
      filter(Boolean),
      map((workouts: Workout[]) => workouts.find((workout: Workout) => workout.$key === paramskey))
    );
  }

}
