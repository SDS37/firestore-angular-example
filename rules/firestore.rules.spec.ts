import { readFileSync } from 'node:fs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestContext,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';
import { afterAll, afterEach, beforeAll, describe, it } from 'vitest';

const paths = [
  'users/alice',
  'users/alice/meals/meal-1',
  'users/alice/workouts/workout-1',
  'users/alice/schedule/schedule-1',
];

function database(context: RulesTestContext): Firestore {
  return context.firestore() as unknown as Firestore;
}

describe('firestore.rules', () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: process.env.GCLOUD_PROJECT ?? 'demo-fir-example-app',
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
  });

  for (const path of paths) {
    it(`lets the owner read and write ${path}`, async () => {
      const owner = database(testEnv.authenticatedContext('alice'));
      const reference = doc(owner, path);
      await assertSucceeds(setDoc(reference, { name: 'ok' }));
      await assertSucceeds(getDoc(reference));
    });

    it(`denies another signed-in user ${path}`, async () => {
      const owner = database(testEnv.authenticatedContext('alice'));
      await assertSucceeds(setDoc(doc(owner, path), { name: 'ok' }));
      const other = database(testEnv.authenticatedContext('bob'));
      await assertFails(getDoc(doc(other, path)));
      await assertFails(setDoc(doc(other, path), { name: 'no' }));
    });

    it(`denies an unauthenticated client ${path}`, async () => {
      const owner = database(testEnv.authenticatedContext('alice'));
      await assertSucceeds(setDoc(doc(owner, path), { name: 'ok' }));
      const anonymous = database(testEnv.unauthenticatedContext());
      await assertFails(getDoc(doc(anonymous, path)));
      await assertFails(setDoc(doc(anonymous, path), { name: 'no' }));
    });
  }

  it('denies a document outside users', async () => {
    const owner = database(testEnv.authenticatedContext('alice'));
    await assertFails(getDoc(doc(owner, 'other/doc')));
    await assertFails(setDoc(doc(owner, 'other/doc'), { name: 'no' }));
  });
});
