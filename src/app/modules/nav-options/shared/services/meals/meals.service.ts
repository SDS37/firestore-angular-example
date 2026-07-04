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

// utils
import { toFirestoreData } from 'src/app/utils/firestore-document';

// rxjs
import { Observable, of } from 'rxjs';
import { tap, map, filter, shareReplay, switchMap } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';

// interfaces
import { Meal } from 'src/app/models/meal.interface';

@Injectable()
export class MealsService {

  meals$: Observable<Meal[]> = authState(this.auth).pipe(
    filter((user): user is NonNullable<typeof user> => !!user),
    switchMap(user => {
      const mealsCollection = collection(this.firestore, `users/${user.uid}/meals`);
      return collectionData(mealsCollection, { idField: '$key' }) as Observable<Meal[]>;
    }),
    shareReplay(1),
    tap((next: Meal[]): void => {
      this.store.set('meals', next);
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

  addMeal(meal: Meal): Promise<DocumentReference> {
    const mealsCollection = collection(this.firestore, `users/${this.uid}/meals`);
    return addDoc(mealsCollection, toFirestoreData(meal));
  }

  updateMeal(key: string, meal: Meal): Promise<void> {
    const mealDoc = doc(this.firestore, `users/${this.uid}/meals/${key}`);
    return updateDoc(mealDoc, toFirestoreData(meal));
  }

  deleteMeal(key: string): Promise<void> {
    const mealDoc = doc(this.firestore, `users/${this.uid}/meals/${key}`);
    return deleteDoc(mealDoc);
  }

  getMeal(paramskey: string): Observable<Meal | undefined> {
    if (!paramskey) {
      return of({
        name: '',
        ingredients: [''],
        timestamp: null,
        $key: '',
        $exists: () => false
      });
    }
    return this.store.select<Meal[]>('meals').pipe(
      filter(Boolean),
      map((meals: Meal[]) => meals.find((meal: Meal) => meal.$key === paramskey))
    );
  }

}
