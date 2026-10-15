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

const documents: Record<string, Record<string, unknown>> = {
  'users/alice': { name: 'ok' },
  'users/alice/meals/meal-1': {
    name: 'Soup',
    ingredients: ['water'],
    timestamp: 1
  },
  'users/alice/workouts/workout-1': {
    name: 'Run',
    type: 'endurance',
    strength: { reps: 0, sets: 0, weight: 0 },
    endurance: { distance: 5, duration: 30 },
    timestamp: 1
  },
  'users/alice/schedule/schedule-1': {
    meals: ['meal-1'],
    workouts: null,
    section: 'morning',
    timestamp: 1
  }
};

const paths = Object.keys(documents);

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
      await assertSucceeds(setDoc(reference, documents[path]));
      await assertSucceeds(getDoc(reference));
    });

    it(`denies another signed-in user ${path}`, async () => {
      const owner = database(testEnv.authenticatedContext('alice'));
      await assertSucceeds(setDoc(doc(owner, path), documents[path]));
      const other = database(testEnv.authenticatedContext('bob'));
      await assertFails(getDoc(doc(other, path)));
      await assertFails(setDoc(doc(other, path), documents[path]));
    });

    it(`denies an unauthenticated client ${path}`, async () => {
      const owner = database(testEnv.authenticatedContext('alice'));
      await assertSucceeds(setDoc(doc(owner, path), documents[path]));
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

  it('denies a meal that has no name', async () => {
    const owner = database(testEnv.authenticatedContext('alice'));
    await assertFails(setDoc(doc(owner, 'users/alice/meals/meal-1'), {
      ingredients: ['water'],
      timestamp: 1
    }));
  });

  it('denies a workout with a negative weight', async () => {
    const owner = database(testEnv.authenticatedContext('alice'));
    await assertFails(setDoc(doc(owner, 'users/alice/workouts/workout-1'), {
      ...documents['users/alice/workouts/workout-1'],
      strength: { reps: 0, sets: 0, weight: -1 }
    }));
  });

  it('denies a schedule section the app does not use', async () => {
    const owner = database(testEnv.authenticatedContext('alice'));
    await assertFails(setDoc(doc(owner, 'users/alice/schedule/schedule-1'), {
      ...documents['users/alice/schedule/schedule-1'],
      section: 'midnight'
    }));
  });
});
