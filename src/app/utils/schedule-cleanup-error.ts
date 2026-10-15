export class ScheduleCleanupError extends Error {
  constructor(label: 'meal' | 'workout') {
    super(`The ${label} was deleted, but the schedule could not be updated.`);
    this.name = 'ScheduleCleanupError';
  }
}

export function deleteFailureMessage(error: unknown, fallback: string): string {
  return error instanceof ScheduleCleanupError ? error.message : fallback;
}
