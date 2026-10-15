# Firestore Angular example documentation

The example proves one claim: an Angular app can use Cloud Firestore as its reactive backend, with no server of its own, and each user sees only their own data.

Read in this order if you are new. Dip in by topic if you are changing one area.

| Document | What it decides |
|---|---|
| [Business requirements](business-requirements.md) | Who the example is for, and what a user can do |
| [Technical requirements](technical-requirements.md) | The proof each area must produce, by TR id |
| [Architecture](architecture.md) | Layers, routes, data model, state, auth and schedule flows |
| [Architecture decision records](architecture-decision-records.md) | Choices already made, and when to reopen them |
| [Roadmap](roadmap.md) | The order of the work, milestones M0–M7, dependency targets |
| [Definition of Done](DoD.md) | When the roadmap is complete |
| [Commits](commits.md) | Commit messages and scopes |

## Code standards

Each file takes its rules from that technology's official documentation and adds only this repo's conventions. Where a file and its source disagree, the source wins. **Today** lines record where the code does not yet follow the file.

| Standard | Applies to | Primary source |
|---|---|---|
| [TypeScript](standards/typescript.md) | Every `.ts` file under `src/` | TypeScript handbook, typescript-eslint |
| [Angular](standards/angular.md) | Components, templates, routes, services, guards, pipes | angular.dev style guide |
| [RxJS](standards/rxjs.md) | Services, the store, composed streams | rxjs.dev |
| [SCSS](standards/scss.md) | Global and component styles | sass-lang.com, MDN CSS |
| [Firestore rules](standards/firestore-rules.md) | `firestore.rules`, `firestore.indexes.json` | Firebase Security Rules docs |
| [Dependencies](standards/dependencies.md) | `package.json`, `package-lock.json`, `.npmrc`, `.nvmrc` | npm docs, Angular update guide |

## Status

M0 is done ([#79](https://github.com/SDS37/firestore-angular-example/issues/79)). The roadmap, the Definition of Done, the code standards, the architecture, the decision records, the requirements, and the root README runbook are written, and the README was followed on a fresh clone through to a deploy. M1 is done ([#85](https://github.com/SDS37/firestore-angular-example/issues/85)): [#57](https://github.com/SDS37/firestore-angular-example/pull/57) is merged, and the repo no longer tracks a Firebase CLI cache, Realtime Database rules, or a Protractor folder. M2 is done ([#88](https://github.com/SDS37/firestore-angular-example/issues/88)): one Firebase SDK, Angular 22.2, current tooling, and `npm audit --omit=dev` reports no critical or high finding. M3 is done ([#93](https://github.com/SDS37/firestore-angular-example/issues/93)): the app builds with `@angular/build`, tests run on Vitest, Sass loads with `@use`, and `strict` and `strictTemplates` are on. M4 is done ([#98](https://github.com/SDS37/firestore-angular-example/issues/98)): GitHub Actions runs verify, Dependabot groups version updates, the Firestore rules are tested on the emulators, and a merge to `master` deploys hosting and the rules. M5 is done ([#103](https://github.com/SDS37/firestore-angular-example/issues/103)): logout clears the store and the previous query, a failed write shows a snackbar, and schedule entries store ids. The next milestone is [M6](https://github.com/SDS37/firestore-angular-example/issues/108). Requirements that have no observation yet are marked **Not yet** in [technical-requirements.md](technical-requirements.md), with the story that closes each one.
