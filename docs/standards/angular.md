# Angular standard

**Applies to:** components, templates, routes, services, guards, and pipes under `src/app/`.

**Primary sources:** the [Angular style guide](https://angular.dev/style-guide), [angular.dev](https://angular.dev/overview), and [angular-eslint](https://github.com/angular-eslint/angular-eslint). Where this file and those sources disagree, the sources win.

## Containers and components

The app splits each feature into containers and presentational components. Keep that split.

| Kind | Lives in | Does | Does not |
|---|---|---|---|
| Container | `containers/` | Injects services and the `Store`, subscribes, handles route params, calls writes | Render complex markup |
| Component | `components/` | Takes `@Input()`, emits `@Output()`, renders | Inject data services or call Firestore |

- Presentational components use `ChangeDetectionStrategy.OnPush`. **Today:** `auth-form`, `schedule-calendar`, and `not-found` still use the default strategy.
- A container that subscribes in `ngOnInit` unsubscribes in `ngOnDestroy`. Prefer the `async` pipe when the template is the only reader.

## Services and Firestore

- Only services under `shared/services/` talk to Firestore, and only through the wrappers in `src/app/utils/firestore.utils.ts` and `firebase-auth.utils.ts`. The wrappers exist so specs can replace them (`src/app/testing/firebase-test-harness.ts`).
- A data service derives its query from the auth state (`observeAuthState(...).pipe(switchMap(...))`), never from a user id captured once.
- Every document path is under `users/{uid}/`. A path outside it is denied by `firestore.rules`.

## Providers

- **Target:** `@Injectable({ providedIn: 'root' })` for services and guards. **Today:** services are provided through `SharedModule.forRoot()` in the auth and nav-options modules. [FAE-053](https://github.com/SDS37/firestore-angular-example/issues/107) moves them, unless [#57](https://github.com/SDS37/firestore-angular-example/pull/57) already did.
- Firebase is provided once, in `AppModule`, with `provideFirebaseApp`, `provideAuth`, and `provideFirestore`.

## Components and modules

- **Today:** components are declared in NgModules (`standalone: false`). [#57](https://github.com/SDS37/firestore-angular-example/pull/57) migrates them to standalone components. New code follows whichever style `master` uses when the PR opens.
- Features are lazy-loaded with `loadChildren` and a dynamic `import()`.
- Routes that need a user use `canActivate: [AuthGuard]`.

## Templates

- Inline templates are the convention in this repo. Move a template to an `.html` file when it passes about 100 lines.
- **Today:** templates use `*ngIf` and `*ngFor`; the ESLint rule `prefer-control-flow` is off. A migration to `@if` / `@for` is a separate PR, not part of a feature change.
- Use Angular Material components through `MaterialModule`; do not import a Material module directly into a feature.
- Forms are reactive (`FormBuilder`). Validation messages use `mat-error`.

## Selectors

Component selectors are kebab-case. **Today:** most selectors have no `app-` prefix (`meals`, `list-item`), and the selector rules are off in `eslint.config.js`. Do not rename existing selectors in a feature PR.
