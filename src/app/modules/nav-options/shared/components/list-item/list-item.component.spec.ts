import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListItemComponent } from './list-item.component';
import { JoinPipe } from '../../pipes/join.pipe';
import { WorkoutPipe } from '../../pipes/workout.pipe';

describe('ListItemComponent', () => {
  let fixture: ComponentFixture<ListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ListItemComponent, JoinPipe, WorkoutPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(ListItemComponent);
  });

  it('should build a meal route when ingredients exist', () => {
    fixture.componentInstance.item = {
      name: 'Soup',
      ingredients: ['water'],
      timestamp: 1,
      $key: 'meal-1',
      $exists: () => true
    };

    expect(fixture.componentInstance.getRoute(fixture.componentInstance.item)).toEqual(['../meals', 'meal-1']);
  });

  it('should build a workout route when ingredients are absent', () => {
    fixture.componentInstance.item = {
      name: 'Run',
      type: 'endurance',
      strength: {},
      endurance: {},
      timestamp: 1,
      $key: 'workout-1',
      $exists: () => true
    };

    expect(fixture.componentInstance.getRoute(fixture.componentInstance.item)).toEqual(['../workouts', 'workout-1']);
  });

  it('should emit remove events', () => {
    const item = { name: 'Soup', ingredients: ['water'], timestamp: 1, $key: 'meal-1', $exists: () => true };
    fixture.componentInstance.item = item;
    vi.spyOn(fixture.componentInstance.remove, 'emit');

    fixture.componentInstance.removeItem();

    expect(fixture.componentInstance.remove.emit).toHaveBeenCalledWith(item);
  });

  it('should use workout delete labels for workout items', () => {
    fixture.componentInstance.item = {
      name: 'Run',
      type: 'endurance',
      strength: {},
      endurance: {},
      timestamp: 1,
      $key: 'workout-1',
      $exists: () => true
    };
    expect(fixture.componentInstance.deleteLabel).toBe('Delete workout');
    expect(fixture.componentInstance.cancelDeleteLabel).toBe('Cancel delete workout');
  });
});
