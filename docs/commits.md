# Commits

Messages follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
type(scope): short description
```

The description is the reason, in the imperative, and it fits on one line. When the commit belongs to a story, put the story id in the PR title, not in every commit: `docs: add the roadmap and definition of done (FAE-005)`.

## Types

| Type | When |
|---|---|
| feat | A new user-visible behaviour |
| fix | A bug fix |
| docs | Documentation only |
| style | Formatting only |
| refactor | A change that neither fixes a bug nor adds a feature |
| perf | A performance change |
| test | Tests only |
| build | Build system or dependencies |
| ci | CI configuration |
| chore | Tooling and other housekeeping |
| revert | Reverts a previous commit |

## Scopes

Use the area the change lives in.

| Scope | Area |
|---|---|
| auth | `src/app/modules/auth`: login, register, guard, `AuthService` |
| meals | `src/app/modules/nav-options/meals` and `MealsService` |
| workouts | `src/app/modules/nav-options/workouts` and `WorkoutsService` |
| schedule | `src/app/modules/nav-options/schedule` and `ScheduleService` |
| store | `src/app/store` |
| rules | `firestore.rules` and `firestore.indexes.json` |
| deps | `package.json` and `package-lock.json` |
| ci | `.github/` |
| docs | `README.md` and `docs/` |
| infra | `firebase.json`, `.firebaserc`, `angular.json`, environments |

Omit the scope when the change is the whole repo (`docs: add the code standards`).

## Examples

```
feat(schedule): store meal ids instead of names
fix(auth): clear every store key on logout
build(deps): move all Angular packages to 22.2
test(rules): deny reads of another user's meals
docs: describe the AngularFire overrides
```

## What a commit contains

- One change. A commit that upgrades dependencies and also refactors a component is two commits.
- Passing `npm run verify` at that commit.
- No service-account keys, no `.env` files, no tokens. The Firebase web config in `src/environments/` is public by design and is the only Firebase config in the repo.
