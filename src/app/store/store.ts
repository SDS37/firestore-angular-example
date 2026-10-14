import { Injectable } from '@angular/core';

// interfaces
import { State } from './state';

// rxjs
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

const defaultState: State = {
  user: undefined,
  meals: undefined,
  workouts: undefined,
  date: undefined,
  schedule: undefined,
  selected: undefined,
  list: undefined
};

@Injectable({ providedIn: 'root' })
export class Store {

  private behaviourSubject = new BehaviorSubject<State>(defaultState);

  private store = this.behaviourSubject.asObservable().pipe(
    distinctUntilChanged()
  );

  get value(): State {
    return this.behaviourSubject.value;
  }

  select<T>(name: keyof State): Observable<T> {
    return this.store.pipe(
      map(state => state[name] as T)
    );
  }

  set<K extends keyof State>(name: K, state: State[K]): void {
    this.behaviourSubject.next({
      ...this.value,
      [name]: state
    });
  }

}
