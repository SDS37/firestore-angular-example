# Dependencies standard

**Applies to:** `package.json`, `package-lock.json`, `.npmrc`, and `.nvmrc`.

**Primary sources:** [npm docs](https://docs.npmjs.com/) (`overrides`, `peerDependencies`, `npm audit`), the [Angular update guide](https://angular.dev/update-guide), and the [Angular version compatibility table](https://angular.dev/reference/versions).

## The rule

Every package is on the newest stable version that all of its peers accept. When a peer range blocks a newer major, the package stays, and the reason is written in two places: the dependency table in the [roadmap](../roadmap.md#dependency-targets) and an ADR.

## Practice

- **Node:** the version in `.nvmrc`, inside the `engines` range in `package.json`. Use `nvm install` (installs the `.nvmrc` version if missing, then switches to it) before `npm ci`.
- **Install:** `npm ci` for a clean tree. `npm install <pkg>` only when changing a dependency.
- **Angular:** every `@angular/*` package moves together with `ng update`, in one commit. Never merge a PR that moves one Angular package alone.
- **Peer conflicts:** solve them with an explicit `overrides` entry and an ADR. There is no `legacy-peer-deps`. [ADR-002](../architecture-decision-records.md#adr-002-angularfire-with-explicit-overrides) maps AngularFire onto the root Angular packages and onto `firebase` 12.19.0, and pins `rxfire` to 6.2.0. [ADR-006](../architecture-decision-records.md#adr-006-grpc-js-pinned-to-1146) pins `@grpc/grpc-js` to 1.14.6.
- **Audit:** `npm audit fix` without `--force`. `npm audit --omit=dev` reports no critical or high before a release.
- **Pre-releases:** no `rc`, `next`, or `canary` versions.
- **Dependabot:** `.github/dependabot.yml` opens one version-update PR per family each week (`angular`, `firebase`, `lint`, `test`) and one GitHub Actions PR each month. It ignores `firebase` 13 ([ADR-002](../architecture-decision-records.md#adr-002-angularfire-with-explicit-overrides)), TypeScript 7 ([ADR-005](../architecture-decision-records.md#adr-005-typescript-pinned-to-60)), `@firebase/rules-unit-testing` 6, and `@types/node` 25 or newer (the Node major in `.nvmrc` is 24). Security updates stay off in the repository settings.

## Accepted dev-only findings

Advisories that remain in `devDependencies` after `npm audit fix` are listed here with the reason they stay. `npm audit --omit=dev` reports none. The fixes npm offers for the rows below are downgrades, which [FAE-023](https://github.com/SDS37/firestore-angular-example/issues/92) does not take.

| Package | Advisory | Reached through | Why it stays |
|---|---|---|---|
| `braces`, `chokidar` | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), high. Stack exhaustion in `braces` | `firebase-tools`'s nested `chokidar` | Karma and the Webpack builder are gone ([FAE-031](https://github.com/SDS37/firestore-angular-example/issues/95), [FAE-030](https://github.com/SDS37/firestore-angular-example/issues/94)). `npm audit fix` would install `firebase-tools` 14.23.0, a downgrade. The CLI is not in the app bundle |
| `basic-ftp`, `get-uri`, `pac-proxy-agent`, `proxy-agent` | [GHSA-c475-qrg2-pj4r](https://github.com/advisories/GHSA-c475-qrg2-pj4r), high. Quadratic-time directory listing in `basic-ftp` | `firebase-tools` → `proxy-agent` | `npm audit fix` would install `firebase-tools` 14.23.0. [FAE-022](https://github.com/SDS37/firestore-angular-example/issues/91) keeps 15.x. The CLI is not in the app bundle |
| `@opentelemetry/core`, `@google-cloud/pubsub` | [GHSA-8988-4f7v-96qf](https://github.com/advisories/GHSA-8988-4f7v-96qf), moderate. Unbounded memory in W3C baggage | `firebase-tools` → `@google-cloud/pubsub` | Same downgrade of `firebase-tools` to 14.23.0 |
| `uuid`, `gaxios` | [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq), moderate. Missing buffer check in `uuid` when `buf` is passed | `firebase-tools` → `gaxios` | Same downgrade of `firebase-tools` to 14.23.0 |
