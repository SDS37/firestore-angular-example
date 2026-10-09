# TypeScript standard

**Applies to:** every `.ts` file under `src/`.

**Primary sources:** the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html), the [TSConfig reference](https://www.typescriptlang.org/tsconfig/), and [typescript-eslint](https://typescript-eslint.io/rules/). Where this file and those sources disagree, the sources win.

## Compiler

- The compiler options live in `tsconfig.json`. `tsconfig.app.json` and `tsconfig.spec.json` only change `files`, `include`, and `types`.
- TypeScript stays on the 6.0 line until `@angular/build` accepts a newer one. See [ADR-005](../architecture-decision-records.md#adr-005-typescript-pinned-to-60).
- **Target:** `strict: true`. **Today:** `strict` is `false`. [FAE-033](https://github.com/SDS37/firestore-angular-example/issues/97) turns it on. New code is written so it would compile under `strict`.

## Types

- Model shapes live in `src/app/models/*.interface.ts`, one interface per file.
- Prefer `unknown` to `any`. A new `any` needs a comment that says why the type cannot be known. **Today:** non-spec code has 14 `any` uses, for example `Workout.strength` and `ScheduleList`'s index signature. [FAE-033](https://github.com/SDS37/firestore-angular-example/issues/97) removes them.
- Use `satisfies` when a literal has to match a type but keep its own narrower type (see `environment.firebase satisfies FirebaseOptions`).
- Use type guards for narrowing a stream, as the data services do: `filter((user): user is NonNullable<typeof user> => !!user)`.
- `$key` and `$exists` are client-side fields. They never go to Firestore: writes pass through `toFirestoreData()`.

## Imports

- Import from the package entry point the library documents (`@angular/fire/firestore`, not `@angular/fire/compat`).
- Import app code with the `src/app/...` path, as every file does today. `./` is fine for a file in the same folder.
- No unused imports. ESLint warns on them (`@typescript-eslint/no-unused-vars`).

## Async

- Firestore writes return a `Promise`. Await it inside `try` / `catch` in the container that started it, and show the failure to the user ([FAE-051](https://github.com/SDS37/firestore-angular-example/issues/105)).
- Streams stay `Observable`. Do not convert a stream to a `Promise` to read one value from it.

## Naming

- Classes and interfaces: `PascalCase`. Functions, variables, properties: `camelCase`. Module-level route arrays: `ROUTES`.
- Observable properties end in `$`: `meals$`, `schedule$`.
- File names follow the Angular CLI: `meals.service.ts`, `meal-form.component.ts`, `meal.interface.ts`.

## Lint

`npm run lint` runs ESLint with `@eslint/js` recommended, `typescript-eslint` recommended, and `angular-eslint` recommended, configured in `eslint.config.js`. A PR does not add a new warning.
