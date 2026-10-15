import { User } from 'src/app/models/user.interface';
import { Meal } from 'src/app/models/meal.interface';
import { Workout } from 'src/app/models/workout.interface';
import { ScheduleList } from 'src/app/models/schedule-list.interface';
import { ScheduleSectionEvent } from 'src/app/models/schedule-section-event.interface';

export interface State {
  user: User | null | undefined;
  meals: Meal[] | undefined;
  workouts: Workout[] | undefined;
  date: Date | undefined;
  schedule: ScheduleList | undefined;
  selected: ScheduleSectionEvent | undefined;
  list: (Meal | Workout)[] | undefined;
}
