export interface ScheduleItem {
  meals: string[] | null;
  workouts: string[] | null;
  section: string;
  timestamp: number;
  $key?: string;
}
