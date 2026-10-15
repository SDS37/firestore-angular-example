# Architecture decision records

Each record states the context, the decision, its consequences, and the condition that would reopen it. A decision that is reopened gets a new record that supersedes the old one; the old one stays.

| ADR | Decision | Status |
|---|---|---|
| [ADR-001](#adr-001-cloud-firestore-not-realtime-database) | Cloud Firestore, not the Realtime Database | Accepted |
| [ADR-002](#adr-002-angularfire-with-explicit-overrides) | AngularFire with explicit `overrides` | Accepted |
| [ADR-003](#adr-003-an-rxjs-store-service) | An RxJS store service | Accepted |
| [ADR-004](#adr-004-vitest-instead-of-karma) | Vitest instead of Karma and Jasmine | Accepted (implemented in FAE-031) |
| [ADR-005](#adr-005-typescript-pinned-to-60) | TypeScript pinned to 6.0 | Accepted |
| [ADR-006](#adr-006-grpc-js-pinned-to-1146) | `@grpc/grpc-js` pinned to 1.14.6 | Accepted |

## ADR-001: Cloud Firestore, not Realtime Database

**Context.** The repo used to hold `database.rules.json`, which is written for the Realtime Database. The data services read and write Cloud Firestore through `@angular/fire/firestore`, and `firebase.json` has a `firestore` section and no `database` section.

**Decision.** Cloud Firestore is the only database. Documents live under `users/{uid}/meals`, `users/{uid}/workouts`, and `users/{uid}/schedule`.

**Consequences.** Security lives in `firestore.rules`. `database.rules.json` protected nothing and was removed in [FAE-011](https://github.com/SDS37/firestore-angular-example/issues/87). The schedule's day query relies on Firestore's automatic single-field index on `timestamp`.

**Reopen when.** Never for this app. A second database would be a new record.

## ADR-002: AngularFire with explicit overrides

**Context.** The app uses Angular 22. The newest stable `@angular/fire` (20.1.1) declares Angular `^20` and depends on `firebase ^11.8.0`. `21.0.0-rc.1` declares Angular `^21.2`. No stable AngularFire declares Angular 22. Before [FAE-020](https://github.com/SDS37/firestore-angular-example/issues/89), `.npmrc` set `legacy-peer-deps=true`, and the tree held two Firebase SDKs: 11.10.0 under AngularFire and 12.15.0 at the root.

**Options.**

1. Keep AngularFire. Map its Angular peers and its `firebase` dependency onto the root versions with `overrides`.
2. Drop AngularFire. Use the Firebase JS SDK and `rxfire` directly behind the existing `utils/` wrappers.

**Decision.** Option 1. `@angular/fire` stays on 20.1.1, the newest stable 20.1 release. `overrides` map `@angular/core`, `@angular/common`, `@angular/platform-browser`, and `firebase` onto the root versions, and `rxfire` resolves to 6.2.0. The `@angular/platform-browser-dynamic` override is dropped; it is not an AngularFire peer. The root `firebase` is 12.19.0. `legacy-peer-deps` is removed, so a new conflict fails the install. Implemented in [FAE-020](https://github.com/SDS37/firestore-angular-example/issues/89).

**Consequences.** One Firebase SDK in the tree. AngularFire runs on an Angular and a Firebase major it was not released against; the unit tests and the end-to-end tests ([M7](https://github.com/SDS37/firestore-angular-example/issues/111)) are the guard. `firebase` 12.19 references `Temporal.Instant`, which TypeScript 6.0 does not ship, so `src/temporal.d.ts` declares that namespace. `firebase` 13 waits until an AngularFire release accepts it. Option 2 stays cheap because every AngularFire call already goes through `src/app/utils/`.

**Reopen when.** A stable `@angular/fire` declares the Angular major in use (remove the overrides), or AngularFire falls two Angular majors behind (move to option 2).

## ADR-003: An RxJS store service

**Context.** Several screens share the user's meals, workouts, and the schedule. The app has a small `Store` class: one `BehaviorSubject<State>`, `select(key)`, and `set(key, value)`. The old README listed "change store to NgRx" as an idea.

**Decision.** Keep the RxJS store service. Do not add NgRx, and do not move the store to Angular signals. Services write to the store in `tap`; components read from it. [FAE-050](https://github.com/SDS37/firestore-angular-example/issues/104) reviewed signals and kept this service: the store is one `BehaviorSubject`, `select` and `set` are typed by `keyof State`, and `reset()` clears every key on logout. A signals store would rewrite every reader for no new capability this app needs.

**Consequences.** No extra dependency and very little code. Nothing enforces who writes which key, so the table in [architecture.md](architecture.md#state) is the contract. Logout calls `reset()` so the next user never reads the previous user's slices.

**Reopen when.** More than one feature needs undo, time travel, or effects across features. That reopens NgRx, not a signals rewrite of this same shape.

## ADR-004: Vitest instead of Karma

**Context.** Karma needed a local Chrome, so tests failed to start where Chrome could not launch. `@angular/build` 22.2 provides `@angular/build:unit-test` with Vitest (`^4.0.8 || ^5.0.0`).

**Decision.** The 73 specs run on `@angular/build:unit-test` with Vitest 5.0.4 and jsdom 30.1.2. Karma and Jasmine are removed. Implemented in [FAE-031](https://github.com/SDS37/firestore-angular-example/issues/95).

**Consequences.** `jasmine.createSpy` and `spyOn` become `vi.fn` and `vi.spyOn`, including in `src/app/testing/firebase-test-harness.ts`. Tests run headless in CI without a browser. The question of Jasmine 7 against `karma-jasmine` 5 goes away.

**Reopen when.** A test needs a real browser API that jsdom does not implement; that test moves to Playwright ([M7](https://github.com/SDS37/firestore-angular-example/issues/111)), not back to Karma.

## ADR-005: TypeScript pinned to 6.0

**Context.** TypeScript 7.0.2 is the latest release. `@angular/build` 22.2.2 accepts `typescript >=6.0 <6.1`, and `typescript-eslint` 8.71.2 accepts `<6.1.0`.

**Decision.** Stay on TypeScript 6.0.x.

**Consequences.** `tsconfig.json` keeps `ignoreDeprecations: "6.0"`. `.github/dependabot.yml` ignores TypeScript 7 and `firebase` 13 ([FAE-041](https://github.com/SDS37/firestore-angular-example/issues/100)). Dependabot security updates stay off.

**Reopen when.** Both `@angular/build` and `typescript-eslint` accept TypeScript 7.

## ADR-006: @grpc/grpc-js pinned to 1.14.6

**Context.** `npm audit --omit=dev` reported a high advisory, [GHSA-m9gg-hp2v-232j](https://github.com/advisories/GHSA-m9gg-hp2v-232j), in `@grpc/grpc-js` `<=1.13.5` and `1.14.0`–`1.14.4`. `@firebase/firestore` 4.17.2, which `firebase` 12.19.0 depends on, depends on `@grpc/grpc-js` `~1.9.0`. `firebase-tools` 15.33.0 reached `1.14.4` through `google-gax`. `npm audit fix` will not move either copy. `npm audit fix --force` would install `firebase` 9.14.0. No `firebase` 12 release depends on a patched `@grpc/grpc-js`. `firebase` 13 stays out until AngularFire accepts it ([ADR-002](#adr-002-angularfire-with-explicit-overrides)).

**Decision.** `overrides` pins `@grpc/grpc-js` to 1.14.6. The browser build of Firestore does not load that package. Implemented in [FAE-023](https://github.com/SDS37/firestore-angular-example/issues/92).

**Consequences.** `npm audit --omit=dev` reports no critical or high finding. The Node entry point of Firestore runs on a grpc version newer than `~1.9.0`.

**Reopen when.** A `firebase` 12 release depends on `@grpc/grpc-js` `>=1.14.5`, or a stable AngularFire accepts `firebase` 13 and that release does. Remove the override then.
