# Definition of Done

The roadmap is done when a colleague can follow the root README and every box below is true. Boxes stay open until the software proves them. Documentation alone does not check them.

## Must

- [x] The root README is a runbook: with Node from `.nvmrc` and a Firebase project, a colleague can install, run, test, and deploy (M0)
- [x] `docs/` holds the requirements, architecture, ADRs, standards, commit convention, roadmap, and this file (M0)
- [ ] [#57](https://github.com/SDS37/firestore-angular-example/pull/57) is merged or closed, and no dead config remains: no tracked `.firebase/`, no Realtime Database rules, no Protractor folder (M1)
- [x] `npm ls` reports one `firebase` version and no invalid package (M2)
- [ ] Every dependency is on the newest stable version its peers accept. Each exception is in the roadmap dependency table and an ADR (M2)
- [ ] `npm audit --omit=dev` reports no critical or high vulnerability (M2)
- [ ] No open Dependabot PR is superseded by work already merged (M2)
- [ ] Build and tests use `@angular/build`, unit tests run on Vitest, and the build prints no deprecation warning (M3)
- [ ] TypeScript `strict` and `strictTemplates` are on (M3)
- [ ] Lint, build, unit tests, and rules tests run in GitHub Actions on every PR, and `master` requires that check (M4)
- [ ] Rules tests on the emulator prove that a user cannot read or write another user's meals, workouts, or schedule (M4)
- [ ] A PR gets a preview URL, and a merge to `master` deploys hosting and rules (M4)
- [ ] Logging out clears every store key. A second user, without a reload, sees only their own data (M5)
- [ ] Schedule entries reference meals and workouts by id. Deleting a meal leaves no dangling entry (M5)
- [ ] A rejected write shows a message to the user (M5)
- [ ] Pinch zoom works and a keyboard-only user can assign a meal on the schedule (M6)
- [ ] Playwright on the emulators covers register, login, create, assign, logout, and the two-user isolation path, in CI (M7)

## Not in this DoD

New features, NgRx, GraphQL, server-side rendering, translations, Firebase App Check, offline persistence, and `firebase` 13 or TypeScript 7 before their peers accept them.
