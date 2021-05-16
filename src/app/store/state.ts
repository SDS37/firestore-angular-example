import { User } from 'src/app/models/user.interface';
import { Meal } from 'src/app/models/meal.interface';
import { Workout } from 'src/app/models/workout.interface';
import { ScheduleItem } from 'src/app/models/schedule-item.interface';

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
