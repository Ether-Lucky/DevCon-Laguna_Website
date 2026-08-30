import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
  });

  test('renders contact hero section, eyebrow, and details', async ({ page }) => {
    await expect(page.getByText('// GET IN TOUCH WITH THE COMMUNITY')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'GET IN TOUCH.' })).toBeVisible();
    await expect(page.getByText('Have questions about the upcoming DevCon?')).toBeVisible();
    await expect(page.getByText('// EMAIL DIRECT')).toBeVisible();
    await expect(page.getByRole('link', { name: 'hello@devconlaguna.com' })).toBeVisible();
    await expect(page.getByText('// COMMUNITY HUB')).toBeVisible();
    await expect(page.getByText('Laguna, Philippines')).toBeVisible();
    await expect(page.getByText('// NETWORK SIGNALS')).toBeVisible();
  });

  test('renders location map embed', async ({ page }) => {
    const mapIframe = page.locator('iframe[title="DevCon Laguna Community Hub Map"]');
    await expect(mapIframe).toBeVisible();
  });

  test('renders form fields with proper labels', async ({ page }) => {
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Subject / Topic')).toBeVisible();
    await expect(page.getByLabel('Your Message')).toBeVisible();
    await expect(page.getByRole('button', { name: 'SEND MESSAGE' })).toBeVisible();
  });

  test('displays inline validation errors when submitting empty form', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: 'SEND MESSAGE' });
    await submitBtn.click();

    await expect(page.getByText('Please enter your full name')).toBeVisible();
    await expect(page.getByText('Please enter your email address')).toBeVisible();
    await expect(page.getByText('Please enter a subject or topic')).toBeVisible();
    await expect(page.getByText('Please enter your message')).toBeVisible();
  });

  test('displays inline error for invalid email address', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Juan Dela Cruz');
    await page.getByLabel('Email Address').fill('not-an-email');
    await page.getByLabel('Subject / Topic').fill('Speaking at DevCon');
    await page.getByLabel('Your Message').fill('I would like to speak about Next.js and Tailwind CSS.');

    await page.getByRole('button', { name: 'SEND MESSAGE' }).click();

    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });
});

