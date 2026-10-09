# Technical requirements

Each requirement has an id, the observation that proves it, and a status. **Observed** means someone ran the check and recorded the result. **Not yet** means no observation exists; the story that produces it is linked. A unit spec counts as an observation of the code path it covers, not of Firebase itself.

Observations below were taken on 2026-10-08 at `f31d0fc` with Node 24.20.0 after `npm ci`, unless the line says otherwise. Application code is unchanged at `82ec18d`, which only added docs.

## TR-1 Auth

| Id | Requirement | Observation | Status |
|---|---|---|---|
| TR-1.1 | A user registers and logs in with email and password through Firebase Auth | `RegisterComponent` and `LoginComponent` specs: success navigates to `/`, failure shows the Firebase error message | Observed (specs) |
| TR-1.2 | The auth form rejects an empty or malformed email and an empty password | `AuthFormComponent` spec: an empty form does not emit, a valid form does. A malformed email is rejected by `Validators.email` in the form; no spec covers that case | Observed (spec and code) |
| TR-1.3 | A signed-out user who opens a guarded route lands on `/auth/login` | `AuthGuard` spec: no user returns a `UrlTree` to `/auth/login` | Observed (spec) |
| TR-1.4 | Logout signs out of Firebase and navigates to `/auth/login` | `AppComponent` spec | Observed (spec) |
| TR-1.5 | Logout clears every store key, so the next user never sees the previous user's data | Today only `user` is reset | Not yet: [FAE-050](https://github.com/SDS37/firestore-angular-example/issues/104) |

## TR-2 Data

| Id | Requirement | Observation | Status |
|---|---|---|---|
| TR-2.1 | Every read and write path is under `users/{uid}` for the current Firebase user | Service specs load meals, workouts, and schedule for the authenticated user | Observed (specs) |
| TR-2.2 | A new user gets a new query without a page reload | Data services build queries in `switchMap` on the auth state | Observed (code). End-to-end: [FAE-071](https://github.com/SDS37/firestore-angular-example/issues/113) |
| TR-2.3 | Client-only fields (`$key`, `$exists`) never reach Firestore | `toFirestoreData` spec; meals and workouts service specs | Observed (specs) |
| TR-2.4 | A new meal or workout gets a `timestamp`; an update keeps the existing one | Meals and workouts service specs cover the timestamp on create; the meals spec covers the update. The workouts update uses the same code path, with no spec | Observed (specs) |
| TR-2.5 | An unknown meal or workout id redirects to its list | `MealComponent` and `WorkoutComponent` specs | Observed (specs) |
| TR-2.6 | A failed write shows a message and keeps the user on the form | Today the error goes to `console.error` | Not yet: [FAE-051](https://github.com/SDS37/firestore-angular-example/issues/105) |

## TR-3 Rules

| Id | Requirement | Observation | Status |
|---|---|---|---|
| TR-3.1 | `firestore.rules` allows read and write under `users/{userId}` only when `request.auth.uid == userId`, and denies everything else | Read from `firestore.rules` | Observed (file) |
| TR-3.2 | Emulator tests prove the owner is allowed, and another user and an anonymous client are denied | No rules tests exist | Not yet: [FAE-042](https://github.com/SDS37/firestore-angular-example/issues/101) |
| TR-3.3 | `npm run deploy:firebase` deploys the rules with hosting | `firebase.json` has `firestore.rules` and the hosting target; the script runs `firebase deploy --only firestore:rules,hosting`. Run on 2026-10-09: rules and hosting released to `fir-example-app-5c3d3`, and anonymous reads of `users` return 403 | Observed |

## TR-4 Schedule

| Id | Requirement | Observation | Status |
|---|---|---|---|
| TR-4.1 | The schedule for a day is the documents whose `timestamp` falls inside that local day, keyed by section | `ScheduleService` specs: documents map to a section-keyed object; the first wins on a duplicate section | Observed (specs) |
| TR-4.2 | Assigning to a section updates its document if it exists, otherwise creates one | `ScheduleService` specs | Observed (specs) |
| TR-4.3 | The week view selects a day and moves by whole weeks | `ScheduleCalendarComponent` and `ScheduleControlsComponent` specs | Observed (specs) |
| TR-4.4 | Schedule entries reference meals and workouts by id; deleting one leaves no dangling entry | Today entries hold names | Not yet: [FAE-052](https://github.com/SDS37/firestore-angular-example/issues/106) |

## TR-5 PWA and accessibility

| Id | Requirement | Observation | Status |
|---|---|---|---|
| TR-5.1 | The production build writes a service worker and a manifest | `dist/firebase-example-app/browser` contains `ngsw-worker.js`, `ngsw.json`, and `manifest.webmanifest` | Observed |
| TR-5.2 | The app registers that service worker in production | No code in `src/` registers it; the registration was removed in `0cdcfcf` | Not yet: no story covers it |
| TR-5.3 | Pinch zoom works and a keyboard-only user can assign a meal | `index.html` sets `maximum-scale=1.0`; the assign list is clickable `div`s | Not yet: [FAE-060](https://github.com/SDS37/firestore-angular-example/issues/109) |
| TR-5.4 | An unknown URL renders the not-found page | The `**` route in `app.routes.ts`; `NotFoundComponent` spec | Observed (code and spec) |

## TR-6 Tooling

| Id | Requirement | Observation | Status |
|---|---|---|---|
| TR-6.1 | `npm ci` installs on the Node version in `.nvmrc` or `engines` | Installs on Node 24.20.0. Node 14.19.1 is outside `engines` | Observed |
| TR-6.2 | `npm run lint` reports no errors | 0 errors, 12 warnings | Observed |
| TR-6.3 | `npm run build` succeeds | Succeeds; warns that Sass `@import` is deprecated | Observed |
| TR-6.4 | `npm test` passes | 73 of 73 specs pass in ChromeHeadless 154 | Observed |
| TR-6.5 | `npm ls` reports one `firebase` version and no invalid package | On 2026-10-09, after the `firebase` override: `npm ls` exits 0 and `npm ls firebase` shows 12.15.0 only. Before it, 11.10.0 and 12.15.0 were both installed and `npm ls` exited with `ELSPROBLEMS` | Observed |
| TR-6.6 | `npm audit --omit=dev` reports no critical or high | `npm audit --omit=dev` reports 11 (7 high, 4 moderate). `npm audit` reports 63 (6 critical, 33 high) across all dependencies | Not yet: [FAE-023](https://github.com/SDS37/firestore-angular-example/issues/92) |
| TR-6.7 | CI runs lint, build, and tests on every PR | No `.github/` folder | Not yet: [FAE-040](https://github.com/SDS37/firestore-angular-example/issues/99) |

## Beyond these requirements

Ideas from the old README checklist (last present at `f3854fe`) are not requirements: NgRx, GraphQL, optimistic UI, translations, local storage. They come back only through a new roadmap.
