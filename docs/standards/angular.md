# Angular standard

**Applies to:** components, templates, routes, services, guards, and pipes under `src/app/`.

**Primary sources:** the [Angular style guide](https://angular.dev/style-guide), [angular.dev](https://angular.dev/overview), and [angular-eslint](https://github.com/angular-eslint/angular-eslint). Where this file and those sources disagree, the sources win.

## Containers and components

The app splits each feature into containers and presentational components. Keep that split.

| Kind | Lives in | Does | Does not |
|---|---|---|---|
| Container | `containers/` | Injects services and the `Store`, subscribes, handles route params, calls writes | Render complex markup |
| Component | `components/` | Takes `input()`, emits `output()`, renders | Inject data services or call Firestore |

- Change detection defaults to `OnPush`. Omit `changeDetection` unless a component needs `ChangeDetectionStrategy.Eager`.
- Omit `standalone: true`. Components, directives, and pipes are standalone unless `standalone: false` is set.
- Read an observable with `toSignal` from `@angular/core/rxjs-interop`. It unsubscribes when the component is destroyed. Do not call `ChangeDetectorRef.detectChanges()`.
- Derive view state from input signals with `computed`. Read an input once in `ngOnInit` when a form needs its initial value. Do not implement `OnChanges`, and do not use `effect` to copy component state.
- Inject with `inject()`. Do not add a constructor only to receive dependencies.

## Services and Firestore

- Only services under `shared/services/` talk to Firestore, and only through the wrappers in `src/app/utils/firestore.utils.ts` and `firebase-auth.utils.ts`. The wrappers exist so specs can replace them (`src/app/testing/firebase-test-harness.ts`).
- A data service derives its query from the auth state (`observeAuthState(...).pipe(switchMap(...))`), never from a user id captured once.
- Every document path is under `users/{uid}/`. A path outside it is denied by `firestore.rules`.

## Providers

- Services, guards, and the `Store` use `@Service()`. Do not add a provider to a component or a route for a service the whole app shares.
- Firebase is provided once, in `src/app/app.config.ts`, with `provideFirebaseApp`, `provideAuth`, and `provideFirestore`.

## Components and routes

- Components and pipes are standalone, and the flag is omitted because that is the default. There are no NgModules; do not add one.
- A component's `imports` lists exactly what its template uses: Angular directives and pipes, child components, `ReactiveFormsModule`, `RouterLink`, and Material modules.
- `src/main.ts` calls `bootstrapApplication(AppComponent, appConfig)`. Root routes live in `src/app/app.routes.ts`.
- Features are lazy-loaded with `loadChildren` and a dynamic `import()` of the feature's `*.routes.ts` file.
- Routes that need a user use `canActivate: [AuthGuard]`.

## Templates

- Inline templates are the convention in this repo. Move a template to an `.html` file when it passes about 100 lines.
- Templates use `@if`, `@for`, and `@else`. Do not add `*ngIf` or `*ngFor`. The ESLint rules `prefer-control-flow`, `prefer-inject`, and `prefer-standalone` are on.
- Import each Material module from its own entry point (`@angular/material/button`) into the component that uses it. A missing `MatButtonModule` or `MatInputModule` does not fail the build: the button renders unstyled, or the form field throws at runtime.
- Forms are reactive (`FormBuilder`). Validation messages use `mat-error`.

## Selectors

Component selectors are kebab-case. **Today:** most selectors have no `app-` prefix (`meals`, `list-item`), and the selector rules are off in `eslint.config.js`. Do not rename existing selectors in a feature PR.
