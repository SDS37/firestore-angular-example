// interfaces
import { State } from './state';

// rxjs
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

const defaultState: State  = {
  user: undefined,
  meals: undefined,
  workouts: undefined,
  date: undefined,
  schedule: undefined,
  selected: undefined,
  list: undefined
};

export class Store {

  // BehaviourSubject accepts initial value 'state'
  private behaviourSubject = new BehaviorSubject<State>(defaultState);

  private store = this.behaviourSubject.asObservable().pipe (
    distinctUntilChanged(),
    // for dev
    // tap( store => console.log('store', store))
  );

  get value(): State {
    return this.behaviourSubject.value;
  }

  // <T>  generic type
  select<T>(name: string): Observable<T> {
    return this.store.pipe (
      pluck(name)
    );
  }

  set(name: string, state: any): void {
    this.behaviourSubject.next(
      // spread ... - merge objects
      {
        ...this.value,
        [name]: state
      }
    );
  }

}
