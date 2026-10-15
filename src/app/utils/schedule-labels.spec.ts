import { scheduleEntryLabel } from './schedule-labels';

const meals = [
  { $key: 'meal-1', name: 'Omelette' },
  { $key: 'meal-2', name: 'Soup' }
];

describe('scheduleEntryLabel', () => {
  it('should show the current name for a stored id', () => {
    expect(scheduleEntryLabel('meal-1', meals)).toBe('Omelette');
  });

  it('should keep a legacy stored name that still matches a meal', () => {
    expect(scheduleEntryLabel('Soup', meals)).toBe('Soup');
  });

  it('should mark an id or name that no longer exists as deleted', () => {
    expect(scheduleEntryLabel('meal-9', meals)).toBe('Deleted');
    expect(scheduleEntryLabel('Toast', meals)).toBe('Deleted');
  });
});
