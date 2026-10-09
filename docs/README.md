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

Each file takes its rules from that technology's official documentation. Repo rules on top of those sources exist only to keep Firestore access inside the data services.

| Standard | Applies to | Primary source |
|---|---|---|
| [TypeScript](standards/typescript.md) | Every `.ts` file under `src/` | TypeScript handbook, typescript-eslint |
| [Angular](standards/angular.md) | Components, templates, routes, services, guards, pipes | angular.dev style guide |
| [RxJS](standards/rxjs.md) | Services, the store, composed streams | rxjs.dev |
| [SCSS](standards/scss.md) | Global and component styles | sass-lang.com, MDN CSS |
| [Firestore rules](standards/firestore-rules.md) | `firestore.rules`, `firestore.indexes.json` | Firebase Security Rules docs |
| [Dependencies](standards/dependencies.md) | `package.json`, `.npmrc`, `.nvmrc` | npm docs, Angular update guide |

## Status

M0 is in progress. The roadmap, the Definition of Done, the code standards, the architecture, the decision records, and the requirements are written. The root README runbook is [FAE-001](https://github.com/SDS37/firestore-angular-example/issues/80). Requirements that have no observation yet are marked **Not yet** in [technical-requirements.md](technical-requirements.md), with the story that closes each one.
