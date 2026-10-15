import { expect, type Page } from '@playwright/test';

export const password = 'password1';

export function userEmail(label: string): string {
  return `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
}

export async function register(page: Page, email: string): Promise<void> {
  await page.goto('/auth/register');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'register' }).click();
  await expect(page.getByRole('heading', { name: 'Schedule' })).toBeVisible();
}

export async function login(page: Page, email: string): Promise<void> {
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'login' }).click();
  await expect(page.getByRole('heading', { name: 'Schedule' })).toBeVisible();
}

export async function logout(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page.getByRole('heading', { name: 'login' })).toBeVisible();
}

export async function createMeal(page: Page, name: string): Promise<void> {
  await page.getByRole('link', { name: 'Meals' }).click();
  await page.getByRole('link', { name: 'New' }).click();
  await page.getByRole('textbox', { name: 'Meal name' }).fill(name);
  await page.getByRole('textbox', { name: 'Ingredient' }).fill('eggs');
  await page.getByRole('button', { name: 'Create meal' }).click();
  await expect(page.getByRole('heading', { name: 'Meals' })).toBeVisible();
  await expect(page.getByText(name)).toBeVisible();
}

export async function createWorkout(page: Page, name: string): Promise<void> {
  await page.getByRole('link', { name: 'Workouts' }).click();
  await page.getByRole('link', { name: 'New' }).click();
  await page.getByRole('textbox', { name: 'Workout name' }).fill(name);
  await page.getByRole('button', { name: 'Create workout' }).click();
  await expect(page.getByRole('heading', { name: 'Workouts' })).toBeVisible();
  await expect(page.getByText(name)).toBeVisible();
}

export function morning(page: Page) {
  return page.locator('schedule-section').filter({ hasText: 'MORNING' });
}

export async function assignToMorning(page: Page, kind: 'meal' | 'workout', name: string): Promise<void> {
  await page.getByRole('link', { name: 'Schedule' }).click();
  const section = morning(page);
  const assignLabel = kind === 'meal' ? 'Assign meal' : 'Assign workout';
  await section.getByRole('button', { name: assignLabel }).click();
  await page.getByRole('button', { name }).click();
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(section.getByRole('button', { name })).toBeVisible();
}
