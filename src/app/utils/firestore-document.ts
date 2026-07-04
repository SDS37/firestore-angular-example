/**
 * Removes AngularFire/client metadata before persisting to Firestore.
 */
export function toFirestoreData<T extends object>(data: T): Record<string, unknown> {
  const record = { ...(data as Record<string, unknown>) };
  delete record.$key;
  delete record.$exists;
  return record;
}
