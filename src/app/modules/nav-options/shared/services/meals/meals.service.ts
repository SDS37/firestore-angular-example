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
import { Meal } from 'src/app/models/meal.interface';

@Injectable({ providedIn: 'root' })
export class MealsService {

  private readonly environmentInjector = inject(EnvironmentInjector);

  meals$: Observable<Meal[]> = observeAuthState(this.auth).pipe(
    switchMap(user => {
      if (!user) {
        return EMPTY;
      }
      return observeInInjectionContext(this.environmentInjector, () => {
        const mealsCollection = getCollection(this.firestore, `users/${user.uid}/meals`);
        return observeCollectionData<Meal>(mealsCollection, { idField: '$key' });
      });
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
    tap((next: Meal[]): void => {
      this.store.set('meals', next);
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

  addMeal(meal: Meal): Promise<DocumentReference> {
    return runInInjectionContext(this.environmentInjector, () => {
      const mealsCollection = getCollection(this.firestore, `users/${this.uid}/meals`);
      return createDocument(mealsCollection, toFirestoreData({
        ...meal,
        timestamp: meal.timestamp ?? Date.now()
      }));
    });
  }

  updateMeal(key: string, meal: Meal): Promise<void> {
    return runInInjectionContext(this.environmentInjector, () => {
      const mealDoc = getDocument(this.firestore, `users/${this.uid}/meals/${key}`);
      return updateDocument(mealDoc, toFirestoreData(meal));
    });
  }

  async deleteMeal(key: string): Promise<void> {
    const name = this.store.value.meals?.find(meal => meal.$key === key)?.name;
    await runInInjectionContext(this.environmentInjector, () => {
      const mealDoc = getDocument(this.firestore, `users/${this.uid}/meals/${key}`);
      return deleteDocument(mealDoc);
    });
    try {
      await this.scheduleService.removeReferences('meals', key, name);
    } catch {
      throw new ScheduleCleanupError('meal');
    }
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
    return this.store.select('meals').pipe(
      filter(Boolean),
      map((meals: Meal[]) => meals.find((meal: Meal) => meal.$key === paramskey))
    );
  }

}
