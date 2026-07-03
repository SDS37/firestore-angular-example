import { User } from 'src/app/models/user.interface';
import { Meal } from 'src/app/models/meal.interface';
import { Workout } from 'src/app/models/workout.interface';
import { ScheduleList } from 'src/app/models/schedule-list.interface';

export interface State {
  user: User | null;
  meals: Meal[];
  workouts: Workout[];
  date: Date;
  schedule: ScheduleList;
  selected: unknown;
  list: Meal[] | Workout[];
}
