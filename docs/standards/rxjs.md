# RxJS standard

**Applies to:** services, the `Store`, and any container that composes streams.

**Primary source:** [rxjs.dev](https://rxjs.dev/guide/overview), including the [operator decision tree](https://rxjs.dev/operator-decision-tree). Where this file and that source disagree, the source wins.

## Operators

- Import operators from `rxjs/operators` or `rxjs`; never from `rxjs/internal`.
- Use `switchMap` when a new source value makes the previous request irrelevant (auth user, selected date). This is how the data services drop the previous user's query.
- Use `shareReplay({ bufferSize: 1, refCount: true })` when several subscribers read one Firestore listener. Put it after the operators whose work should be shared. **Today:** `MealsService.meals$` and `WorkoutsService.workouts$` put `tap(store.set)` after `shareReplay`, so the store write runs once per subscriber.
- Use `withLatestFrom` to read the current value of another stream without subscribing to it twice (see `ScheduleService.items$`).
- Side effects belong in `tap`, and the only side effect a service performs in `tap` is `store.set(...)`.

## Subscriptions

- A `Subscription` taken in a component is released in `ngOnDestroy`.
- Prefer the `async` pipe in templates.
- Do not nest `subscribe` calls. Compose with an operator instead.

## Subjects

- `BehaviorSubject` when the stream needs a current value (`Store`, the selected date).
- `Subject` for events with no initial value (the selected schedule section, the assigned items).
- Expose subjects as observables or through methods (`updateDate`, `selectSection`). Callers do not call `next` on a service's subject.

## The Store

`src/app/store/store.ts` holds one `BehaviorSubject<State>`. `select(key)` reads a slice. `set(key, value)` replaces one slice and keeps the others. Both are typed by `keyof State`. Components read from the store; services write to it.
