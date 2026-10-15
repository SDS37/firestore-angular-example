import { Pipe, PipeTransform } from '@angular/core';
import { Workout } from 'src/app/models/workout.interface';

@Pipe({
  standalone: true,
  name: 'workout'
})
export class WorkoutPipe implements PipeTransform {
  transform(value: Workout): string {
    if (value.type === 'endurance') {
      return `
        Distance: ${value.endurance.distance + 'km'},
        Duration: ${value.endurance.duration + 'mins'}
      `;
    } else {
      return `
        Weight: ${value.strength.weight + 'kg'},
        Reps: ${value.strength.reps},
        Sets: ${value.strength.sets}
      `;
    }
  }
}
