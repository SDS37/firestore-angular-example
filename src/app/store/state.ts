import { User } from '../models/user.interface';
import { Meal } from '../models/meal.interface';
import { Workout } from '../models/workout.interface';
import { ScheduleItem } from '../models/schedule-item.interface';

export interface State {
  user: User;
  meals: Meal[];
  workouts: Workout[];
  date: Date;
  schedule: ScheduleItem[];
  selected: any;
  list: any;
  [key: string]: any;
}
