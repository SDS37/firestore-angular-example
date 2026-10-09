# Architecture decision records

Each record states the context, the decision, its consequences, and the condition that would reopen it. A decision that is reopened gets a new record that supersedes the old one; the old one stays.

| ADR | Decision | Status |
|---|---|---|
| [ADR-001](#adr-001-cloud-firestore-not-realtime-database) | Cloud Firestore, not the Realtime Database | Accepted |
| [ADR-002](#adr-002-angularfire-with-explicit-overrides) | AngularFire with explicit `overrides` | Accepted, not implemented (FAE-020) |
| [ADR-003](#adr-003-an-rxjs-store-service) | An RxJS store service | Accepted, under review in FAE-050 |
| [ADR-004](#adr-004-vitest-instead-of-karma) | Vitest instead of Karma and Jasmine | Accepted, not implemented (FAE-031) |
| [ADR-005](#adr-005-typescript-pinned-to-60) | TypeScript pinned to 6.0 | Accepted |

## ADR-001: Cloud Firestore, not Realtime Database

**Context.** The repo still holds `database.rules.json`, which is written for the Realtime Database. The data services now read and write Cloud Firestore through `@angular/fire/firestore`, and `firebase.json` has a `firestore` section and no `database` section.

**Decision.** Cloud Firestore is the only database. Documents live under `users/{uid}/meals`, `users/{uid}/workouts`, and `users/{uid}/schedule`.

**Consequences.** Security lives in `firestore.rules`. `database.rules.json` protects nothing and is removed in [FAE-011](https://github.com/SDS37/firestore-angular-example/issues/87). The schedule's day query relies on Firestore's automatic single-field index on `timestamp`.

**Reopen when.** Never for this app. A second database would be a new record.

## ADR-002: AngularFire with explicit overrides

**Context.** The app uses Angular 22. The newest stable `@angular/fire` (20.1.0) declares Angular `^20` and depends on `firebase ^11.8.0`. `21.0.0-rc.1` declares Angular `^21.2`. No stable AngularFire declares Angular 22. Today `package.json` maps AngularFire's Angular peers onto the root Angular with `overrides`, and `.npmrc` sets `legacy-peer-deps=true`. That combination installed two Firebase SDKs: 11.10.0 under AngularFire and 12.15.0 at the root.

**Options.**

1. Keep AngularFire. Map its Angular peers and its `firebase` dependency onto the root versions with `overrides`.
2. Drop AngularFire. Use the Firebase JS SDK and `rxfire` directly behind the existing `utils/` wrappers.

**Decision.** Option 1. AngularFire moves from 20.0.1 to 20.1.0. `overrides` map `@angular/core`, `@angular/common`, `@angular/platform-browser`, and `firebase` onto the root versions, and `rxfire` resolves to 6.2.0. The current `@angular/platform-browser-dynamic` entry is dropped; it is not an AngularFire peer. The root `firebase` is 12.19.x. `legacy-peer-deps` is removed so a new conflict fails the install. Implemented in [FAE-020](https://github.com/SDS37/firestore-angular-example/issues/89).

**Consequences.** One Firebase SDK in the tree. AngularFire runs on an Angular and a Firebase major it was not released against; the unit tests and the end-to-end tests ([M7](https://github.com/SDS37/firestore-angular-example/issues/111)) are the guard. `firebase` 13 waits until an AngularFire release accepts it. Option 2 stays cheap because every AngularFire call already goes through `src/app/utils/`.

**Reopen when.** A stable `@angular/fire` declares the Angular major in use (remove the overrides), or AngularFire falls two Angular majors behind (move to option 2).

## ADR-003: An RxJS store service

**Context.** Several screens share the user's meals, workouts, and the schedule. The app has a small `Store` class: one `BehaviorSubject<State>`, `select(key)`, and `set(key, value)`. The old README listed "change store to NgRx" as an idea.

**Decision.** Keep the RxJS store service. Do not add NgRx. Services write to the store in `tap`; components read from it.

**Consequences.** No extra dependency and very little code. Nothing enforces who writes which key, so the table in [architecture.md](architecture.md#state) is the contract. Logout must reset every key explicitly ([FAE-050](https://github.com/SDS37/firestore-angular-example/issues/104)).

**Reopen when.** [FAE-050](https://github.com/SDS37/firestore-angular-example/issues/104) decides whether the store moves to Angular signals. NgRx is reopened only if more than one feature needs undo, time travel, or effects across features.

## ADR-004: Vitest instead of Karma

**Context.** `ng test` uses `@angular-devkit/build-angular:karma`, which Angular has deprecated with the Webpack builders. Karma needs a local Chrome; the tests fail to start where Chrome cannot launch. `@angular/build` 22.2 provides `@angular/build:unit-test` with Vitest (`^4.0.8 || ^5.0.0`).

**Decision.** Move the 73 specs to `@angular/build:unit-test` with Vitest 5 and jsdom, and remove Karma and Jasmine. Implemented in [FAE-031](https://github.com/SDS37/firestore-angular-example/issues/95).

**Consequences.** `jasmine.createSpy` and `spyOn` become `vi.fn` and `vi.spyOn`, including in `src/app/testing/firebase-test-harness.ts`. Tests run headless in CI without a browser. The question of Jasmine 7 against `karma-jasmine` 5 goes away.

**Reopen when.** A test needs a real browser API that jsdom does not implement; that test moves to Playwright ([M7](https://github.com/SDS37/firestore-angular-example/issues/111)), not back to Karma.

## ADR-005: TypeScript pinned to 6.0

**Context.** TypeScript 7.0.2 is the latest release. `@angular/build` 22.2.2 accepts `typescript >=6.0 <6.1`, and `typescript-eslint` 8.71.1 accepts `<6.1.0`.

**Decision.** Stay on TypeScript 6.0.x.

**Consequences.** `tsconfig.json` keeps `ignoreDeprecations: "6.0"`. [FAE-041](https://github.com/SDS37/firestore-angular-example/issues/100) configures Dependabot to ignore TypeScript majors; until then Dependabot can open a TypeScript 7 PR, and it is closed.

**Reopen when.** Both `@angular/build` and `typescript-eslint` accept TypeScript 7.
