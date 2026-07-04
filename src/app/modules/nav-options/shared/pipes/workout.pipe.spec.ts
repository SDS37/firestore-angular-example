import { WorkoutPipe } from './workout.pipe';

describe('WorkoutPipe', () => {
  const pipe = new WorkoutPipe();

  it('should format strength workouts', () => {
    const result = pipe.transform({
      type: 'strength',
      strength: { weight: 50, reps: 10, sets: 3 },
      endurance: {}
    });

    expect(result).toContain('Weight: 50kg');
    expect(result).toContain('Reps: 10');
    expect(result).toContain('Sets: 3');
  });

  it('should format endurance workouts', () => {
    const result = pipe.transform({
      type: 'endurance',
      strength: {},
      endurance: { distance: 5, duration: 30 }
    });

    expect(result).toContain('Distance: 5km');
    expect(result).toContain('Duration: 30mins');
  });
});
