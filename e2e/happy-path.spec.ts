import { test } from '@playwright/test';
import { assignToMorning, createMeal, createWorkout, login, logout, register, userEmail } from './helpers';

test('registers, logs in, plans today, and logs out', async ({ page }) => {
  const email = userEmail('planner');

  await register(page, email);
  await logout(page);
  await login(page, email);
  await createMeal(page, 'Omelette');
  await createWorkout(page, 'Easy run');
  await assignToMorning(page, 'meal', 'Omelette');
  await assignToMorning(page, 'workout', 'Easy run');
  await logout(page);
});
