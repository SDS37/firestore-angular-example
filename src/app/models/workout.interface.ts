import { WorkoutStrength } from './workout-strength.interface';
import { WorkoutEndurance } from './workout-endurance.interface';

export interface Workout {
  name: string;
  type: string;
  strength: WorkoutStrength;
  endurance: WorkoutEndurance;
  timestamp: number | null;
  $key: string;
  $exists: () => boolean;
}
