import { Meal } from './meal.interface';
import { Workout } from './workout.interface';

export interface ScheduleItem {
  meals: Meal[];
  workouts: Workout[];
  section: string;
  timestamp: number;
  $key?: string;
}
