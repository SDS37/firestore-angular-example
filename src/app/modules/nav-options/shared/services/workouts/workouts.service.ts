import { Injectable } from '@angular/core';

// third-party firebase
import { AngularFirestore, DocumentReference, DocumentChangeAction } from '@angular/fire/firestore';
import { User } from 'firebase';

// store
import { Store } from '../../../../../store/store';

// services
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

// rxjs
import { Observable, of } from 'rxjs';
import { tap, map, filter, shareReplay } from 'rxjs/operators';

// interfaces
import { Workout } from '../../../../../models/workout.interface';

@Injectable()
export class WorkoutsService {

  workouts$: Observable<Workout[]> = this.af.collection<User>(`users`).doc(this.uid).collection<Workout>('workouts')
    .snapshotChanges().pipe (
      shareReplay(1),
      map( ( next: DocumentChangeAction<Workout>[] ): Workout[] => {
        return next.map( ( item: DocumentChangeAction<Workout> ): Workout => {
          const data = item.payload.doc.data();
          const $key = item.payload.doc.id;
          return { $key, ...data };
        });
      }),
      tap( ( ( next: Workout[] ): void => {
        this.store.set('workouts', next);
      })
    )
  );

  constructor(
    private af: AngularFirestore,
    private store: Store,
    private authService: AuthService
  ) {}

  get uid(): string {
    return this.authService.user.uid;
  }

  addWorkout(workout: Workout): Promise<DocumentReference> {
    return this.af.collection<User>('users').doc(this.uid).collection<Workout>('workouts').add(workout);
  }

  updateWorkout(key: string, workout: Workout): Promise<void> {
    return this.af.collection<User>('users').doc(this.uid).collection<Workout>('workouts').doc(key).update(workout);
  }

  deleteWorkout(key: string): Promise<void> {
    return this.af.collection<User>('users').doc(this.uid).collection<Workout>('workouts').doc(key).delete();
  }

  getWorkout(paramskey: string): Observable<Workout> {
    if (!paramskey) {
      return of({
        name: '',
        type: '',
        strength: {},
        endurance: {},
        timestamp: null,
        $key: '',
        $exists: () => false
      });
    }
    return this.store.select<Workout[]>('workouts').pipe (
      filter(Boolean),
      map( (workouts: Workout[]): Workout => workouts.find((workout: Workout) => workout.$key === paramskey))
    );
  }

}
