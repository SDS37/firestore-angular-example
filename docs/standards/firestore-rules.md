# Firestore rules standard

**Applies to:** `firestore.rules` and `firestore.indexes.json`.

**Primary sources:** [Firebase Security Rules for Cloud Firestore](https://firebase.google.com/docs/firestore/security/get-started), [writing conditions](https://firebase.google.com/docs/firestore/security/rules-conditions), and [testing rules with the emulator](https://firebase.google.com/docs/rules/unit-tests). Where this file and those sources disagree, the sources win.

## Rules

- The file starts with `rules_version = '2';`.
- Every user document lives under `users/{userId}`. Access is granted only when `request.auth.uid == userId`, through the `isOwner(userId)` function.
- Deny by default. A collection with no `match` block is not readable or writable. Adding a collection means adding its `match` block in the same PR.
- No `allow read, write: if true;`, not even temporarily.
- The Realtime Database is not used. `database.rules.json` does not protect Firestore and is removed in [FAE-011](https://github.com/SDS37/firestore-angular-example/issues/87).

## Indexes

- `firestore.indexes.json` holds composite indexes only. The schedule query (`orderBy('timestamp')` with `startAt` / `endAt` on one collection) uses the automatic single-field index, so the file is empty today.
- When a new query needs a composite index, the index goes into the file in the same PR as the query.

## Tests

- **Target:** every rule has an emulator test that proves an allowed and a denied case: the owner, another signed-in user, and an anonymous client. **Today:** no rules tests exist. [FAE-042](https://github.com/SDS37/firestore-angular-example/issues/101) adds them with `@firebase/rules-unit-testing`.

## Deploy

`npm run deploy:firebase` deploys `firestore:rules` and hosting together. Rules and the client code that depends on them ship in the same deploy.
