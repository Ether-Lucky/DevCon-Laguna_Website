import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// Test cases for Hero
test('renders the DevCon logo', async ({ page }) => {
  const logo = page.getByAltText('DevCon Laguna').first();
  await expect(logo).toBeVisible();
});

test('renders nav links on desktop', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Events', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Partners' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Toggle menu' })).not.toBeVisible();
});

test('renders hero section with heading and buttons', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Building the' })).toBeVisible();
  await expect(page.getByText('Future of Tech,')).toBeVisible();
  await expect(page.getByText('Together.')).toBeVisible();
  await expect(page.getByText('DevCon Laguna is a community of developers')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Volunteer', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Learn More', exact: true })).toBeVisible();
  await expect(page.locator('#hero').getByAltText('DevCon Laguna community collage').first()).toBeVisible();
});


//test case for what we do section
test('renders the What We Do heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'What We Do' })).toBeVisible();
});

test('carousel shows all events', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Workshops/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Hackathons/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Tech Talks/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Projects/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Community', exact: true })).toBeVisible();
});

//Test case for featured events section
test('renders the Featured Events heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Featured Events' })).toBeVisible();
});

test('renders the featured events carousel', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Featured Events' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next slide' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous slide' })).toBeVisible();
});

// Test cases for Officers Section
test('renders officers section', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Meet Our Officers' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next page' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous page' })).toBeVisible();
});

