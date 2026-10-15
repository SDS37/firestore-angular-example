import { Pipe, PipeTransform } from '@angular/core';
import { Workout } from 'src/app/models/workout.interface';

@Pipe({
  standalone: true,
  name: 'workout'
})
export class WorkoutPipe implements PipeTransform {
  transform(value: Workout): string {
    if (value?.type === 'endurance') {
      return `
        Distance: ${this.figure(value.endurance?.distance, 'km')},
        Duration: ${this.figure(value.endurance?.duration, 'mins')}
      `;
    }
    return `
      Weight: ${this.figure(value?.strength?.weight, 'kg')},
      Reps: ${this.figure(value?.strength?.reps)},
      Sets: ${this.figure(value?.strength?.sets)}
    `;
  }

  private figure(value: number | null | undefined, unit = ''): string {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 'none';
    }
    return `${value}${unit}`;
  }
}
