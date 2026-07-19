import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders the DevCon logo', async ({ page }) => {
  const logo = page.getByAltText('DevCon Laguna');
  await expect(logo).toBeVisible();
});

test('renders nav links on desktop', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Events' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sponsors' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Toggle menu' })).not.toBeVisible();
});

test('shows hamburger on mobile and opens menu on click', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Toggle menu' });
  await expect(toggle).toBeVisible();
  await expect(page.getByRole('link', { name: 'Events' })).not.toBeVisible();
  await toggle.click();
  await expect(page.getByRole('link', { name: 'Events' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sponsors' })).toBeVisible();
});

test('renders the What We Do heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'What We Do' })).toBeVisible();
});

test('carousel shows all events', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Workshops/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Hackathons/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Tech Talks/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Projects/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Community/i })).toBeVisible();
});
