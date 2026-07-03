import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentReference
} from '@angular/fire/firestore';

// store
import { Store } from 'src/app/store/store';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

// rxjs
import { Observable, of } from 'rxjs';
import { tap, map, filter, shareReplay, switchMap } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';

// interfaces
import { Workout } from 'src/app/models/workout.interface';

@Injectable()
export class WorkoutsService {

  workouts$: Observable<Workout[]> = authState(this.auth).pipe(
    filter((user): user is NonNullable<typeof user> => !!user),
    switchMap(user => {
      const workoutsCollection = collection(this.firestore, `users/${user.uid}/workouts`);
      return collectionData(workoutsCollection, { idField: '$key' }) as Observable<Workout[]>;
    }),
    shareReplay(1),
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
    const workoutsCollection = collection(this.firestore, `users/${this.uid}/workouts`);
    return addDoc(workoutsCollection, workout);
  }

  updateWorkout(key: string, workout: Workout): Promise<void> {
    const workoutDoc = doc(this.firestore, `users/${this.uid}/workouts/${key}`);
    return updateDoc(workoutDoc, { ...workout });
  }

  deleteWorkout(key: string): Promise<void> {
    const workoutDoc = doc(this.firestore, `users/${this.uid}/workouts/${key}`);
    return deleteDoc(workoutDoc);
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
