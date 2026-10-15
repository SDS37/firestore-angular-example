import { expect, test } from '@playwright/test';
import { createAuthUser, denyWrites, ownerRules, setFirestoreRules } from './emulator-rules';
import {
  assignToMorning,
  createMeal,
  createWorkout,
  login,
  logout,
  morning,
  password,
  register,
  userEmail
} from './helpers';

test('a second user sees none of the first user data without a reload', async ({ page }) => {
  const first = userEmail('owner');
  const second = userEmail('other');
  await createAuthUser(second, password);

  await register(page, first);
  await createMeal(page, 'Private soup');
  await createWorkout(page, 'Private run');
  await assignToMorning(page, 'meal', 'Private soup');
  await assignToMorning(page, 'workout', 'Private run');
  await logout(page);
  await login(page, second);

  await page.getByRole('link', { name: 'Meals' }).click();
  await expect(page.getByText('No meals, add a new meal to start')).toBeVisible();
  await expect(page.getByText('Private soup')).toHaveCount(0);

  await page.getByRole('link', { name: 'Workouts' }).click();
  await expect(page.getByText('No workouts, add a new workout to start')).toBeVisible();
  await expect(page.getByText('Private run')).toHaveCount(0);

  await page.getByRole('link', { name: 'Schedule' }).click();
  const section = morning(page);
  await expect(section.getByRole('button', { name: 'Assign meal' })).toBeVisible();
  await expect(section.getByRole('button', { name: 'Assign workout' })).toBeVisible();
  await expect(page.getByText('Private soup')).toHaveCount(0);
  await expect(page.getByText('Private run')).toHaveCount(0);
});

test('an unknown route shows the not-found page', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page.getByText('404')).toBeVisible();
});

test('a write the rules deny stays on the form and shows the save message', async ({ page }) => {
  await register(page, userEmail('denied'));
  await page.getByRole('link', { name: 'Meals' }).click();
  await page.getByRole('link', { name: 'New' }).click();
  await expect(page.getByRole('heading', { name: 'Create meal' })).toBeVisible();

  await setFirestoreRules(denyWrites);
  try {
    await page.getByRole('textbox', { name: 'Meal name' }).fill('Blocked meal');
    await page.getByRole('textbox', { name: 'Ingredient' }).fill('salt');
    await page.getByRole('button', { name: 'Create meal' }).click();
    await expect(page.getByText('Could not save the meal.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Create meal' })).toBeVisible();
    await expect(page).toHaveURL(/\/meals\/new$/);
  } finally {
    await setFirestoreRules(ownerRules());
  }
});
