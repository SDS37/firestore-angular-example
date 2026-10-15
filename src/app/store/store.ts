import { Service } from '@angular/core';

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

@Service()
export class Store {

  private behaviourSubject = new BehaviorSubject<State>(defaultState);

  private store = this.behaviourSubject.asObservable();

  get value(): State {
    return this.behaviourSubject.value;
  }

  select<K extends keyof State>(name: K): Observable<State[K]> {
    return this.store.pipe(
      map(state => state[name]),
      distinctUntilChanged()
    );
  }

  set<K extends keyof State>(name: K, state: State[K]): void {
    this.behaviourSubject.next({
      ...this.value,
      [name]: state
    });
  }

  reset(): void {
    this.behaviourSubject.next({
      ...defaultState,
      user: null
    });
  }

}
