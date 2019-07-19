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
import { Meal } from '../../../../../models/meal.interface';

@Injectable()
export class MealsService {

  meals$: Observable<Meal[]> = this.af.collection<User>(`users`).doc(this.uid).collection<Meal>('meals')
    .snapshotChanges().pipe (
      // shareReplay. when there are side-effects or taxing computations that should not be executed amongst multiple subscribers.
      // It may also be valuable in situations where there are late subscribers to a stream that need access to previously
      // emitted values. first argument is a number representing the buffer size
      shareReplay(1),
      map( ( next: DocumentChangeAction<Meal>[] ): Meal[] => {
        return next.map( ( item: DocumentChangeAction<Meal> ): Meal => {
          const data = item.payload.doc.data();
          const $key = item.payload.doc.id;
          return { $key, ...data };
        });
      }),
      tap( ( next: Meal[] ): void => {
        this.store.set('meals', next);
      })
  );

  constructor(
    private af: AngularFirestore,
    private store: Store,
    private authService: AuthService
  ) {}

  get uid(): string {
    return this.authService.user.uid;
  }

  addMeal(meal: Meal): Promise<DocumentReference> {
    return this.af.collection<User>('users').doc(this.uid).collection<Meal>('meals').add(meal);
  }

  updateMeal(key: string, meal: Meal): Promise<void> {
    return this.af.collection<User>('users').doc(this.uid).collection<Meal>('meals').doc(key).update(meal);
  }

  deleteMeal(key: string): Promise<void> {
    return this.af.collection<User>('users').doc(this.uid).collection<Meal>('meals').doc(key).delete();
  }

  getMeal(paramskey: string): Observable<Meal> {
    // request to store
    if (!paramskey) {
      return of({
        name: '',
        ingredients: [''],
        timestamp: null,
        $key: '',
        $exists: () => false
      });
    }
    return this.store.select<Meal[]>('meals').pipe (
      filter(Boolean), // if no values (store empty) filter stream will no continue
      map( (meals: Meal[]): Meal => meals.find((meal: Meal) => meal.$key === paramskey))
    );
    // request to firebase
    // return this.af.collection<User>('users').doc(this.uid).collection<Meal>('meals').doc(key).get();
  }

}
