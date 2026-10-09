# Dependencies standard

**Applies to:** `package.json`, `package-lock.json`, `.npmrc`, and `.nvmrc`.

**Primary sources:** [npm docs](https://docs.npmjs.com/) (`overrides`, `peerDependencies`, `npm audit`), the [Angular update guide](https://angular.dev/update-guide), and the [Angular version compatibility table](https://angular.dev/reference/versions).

## The rule

Every package is on the newest stable version that all of its peers accept. When a peer range blocks a newer major, the package stays, and the reason is written in two places: the dependency table in the [roadmap](../roadmap.md#dependency-targets) and an ADR.

## Practice

- **Node:** the version in `.nvmrc`, inside the `engines` range in `package.json`. Use `nvm install` (installs the `.nvmrc` version if missing, then switches to it) before `npm ci`.
- **Install:** `npm ci` for a clean tree. `npm install <pkg>` only when changing a dependency.
- **Angular:** every `@angular/*` package moves together with `ng update`, in one commit. Never merge a PR that moves one Angular package alone.
- **Peer conflicts:** solve them with an explicit `overrides` entry and an ADR. **Today:** `.npmrc` sets `legacy-peer-deps=true`, which hides peer conflicts; it let two Firebase SDKs (11.10.0 and 12.15.0) install side by side. [FAE-020](https://github.com/SDS37/firestore-angular-example/issues/89) removes it.
- **Audit:** `npm audit fix` without `--force`. `npm audit --omit=dev` reports no critical or high before a release.
- **Pre-releases:** no `rc`, `next`, or `canary` versions.
- **Dependabot:** a security PR that bumps one package of a family (for example one `@angular/*` package) is closed in favour of a PR that moves the whole family.

## Accepted dev-only findings

Advisories that remain in `devDependencies` after `npm audit fix` are listed here with the reason they stay. **Today:** none are listed; [FAE-023](https://github.com/SDS37/firestore-angular-example/issues/92) fills this table.

| Package | Advisory | Reached through | Why it stays |
|---|---|---|---|
