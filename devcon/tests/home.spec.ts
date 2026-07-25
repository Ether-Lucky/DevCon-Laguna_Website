import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('#splash-screen').waitFor({ state: 'detached', timeout: 5000 });
});

// Test cases for Hero
test('renders the DevCon logo', async ({ page }) => {
  const logo = page.getByAltText('Devcon Logo').first();
  await expect(logo).toBeVisible();
});

test('renders nav links on desktop', async ({ page }) => {
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Events', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Partners' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Contact' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Toggle menu' })).not.toBeVisible();
});

test('renders hero section with heading and buttons', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Building the' })).toBeVisible();
  await expect(page.getByText('Future of Tech,')).toBeVisible();
  await expect(page.getByText('Together.')).toBeVisible();
  await expect(page.getByText('DevCon Laguna is a community of developers')).toBeVisible();
  await expect(page.locator('#hero').getByRole('link', { name: 'Volunteer', exact: true })).toBeVisible();
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
  await expect(page.getByRole('button', { name: 'Next events' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous events' })).toBeVisible();
});

// Test cases for Officers Section
test('renders officers section', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Meet Our Officers' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next page' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous page' })).toBeVisible();
});

// Test cases for Stats Section
test('renders stats section with all stat cards', async ({ page }) => {
  const stats = page.locator('#partners');
  await expect(stats.getByText('500+')).toBeVisible();
  await expect(stats.getByText('30+')).toBeVisible();
  await expect(stats.getByText('100+')).toBeVisible();
  await expect(stats.getByText('20+')).toBeVisible();
  await expect(stats.getByText('Community Volunteers')).toBeVisible();
  await expect(stats.getByText('Events Organized')).toBeVisible();
  await expect(stats.getByText('Community Reached')).toBeVisible();
  await expect(stats.getByText('Industry Partners')).toBeVisible();
});

test('renders stats section images', async ({ page }) => {
  const stats = page.locator('#partners');
  await expect(stats.getByAltText('Community Volunteers')).toBeVisible();
  await expect(stats.getByAltText('Events Organized')).toBeVisible();
  await expect(stats.getByAltText('Community Reached')).toBeVisible();
  await expect(stats.getByAltText('Industry Partners')).toBeVisible();
});

// Test cases for About Section
test('renders about section with heading and paragraph', async ({ page }) => {
  const about = page.locator('#about');
  await expect(about.getByText('About DevCon Laguna')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Who We Are' })).toBeVisible();
  await expect(about.getByText('DevCon Laguna is a local chapter of the Developers Connect')).toBeVisible();
});

test('renders about slideshow navigation', async ({ page }) => {
  const about = page.locator('#about');
  await expect(about.getByRole('button', { name: 'Next slide' })).toBeVisible();
  await expect(about.getByRole('button', { name: 'Previous slide' })).toBeVisible();
  await expect(about.getByRole('button', { name: 'Go to slide 1' })).toBeVisible();
  await expect(about.getByRole('button', { name: 'Go to slide 2' })).toBeVisible();
  await expect(about.getByRole('button', { name: 'Go to slide 3' })).toBeVisible();
  await expect(about.getByRole('button', { name: 'Go to slide 4' })).toBeVisible();
});

// Test cases for Mission and Vision Section
test('renders mission and vision cards', async ({ page }) => {
  const mv = page.locator('#mission-vision');
  await expect(mv.getByRole('heading', { name: 'Mission' })).toBeVisible();
  await expect(mv.getByRole('heading', { name: 'Vision' })).toBeVisible();
  await expect(mv.getByText(/To empower developers/)).toBeVisible();
  await expect(mv.getByText(/To cultivate a thriving/)).toBeVisible();
});

// Test cases for Programs and Activities Section
// test('renders programs and activities carousel with buttons', async ({ page }) => {
//   await expect(page.getByRole('button', { name: 'Join Us' })).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Learn More' })).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Go to slide 1' })).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Go to slide 2' })).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Go to slide 3' })).toBeVisible();
// });

// Test cases for Footer Section
test('renders footer with logo and copyright', async ({ page }) => {
  const footer = page.locator('footer');
  await expect(footer.getByAltText('Devcon Logo').first()).toBeVisible();
  await expect(footer.getByText('© 2026 DEVCON Laguna')).toBeVisible();
});

test('renders footer link columns', async ({ page }) => {
  const footer = page.locator('footer');
  await expect(footer.getByRole('heading', { name: 'Explore' })).toBeVisible();
  await expect(footer.getByRole('heading', { name: 'Resources' })).toBeVisible();
  await expect(footer.getByRole('heading', { name: 'Support' })).toBeVisible();
  await expect(footer.getByRole('heading', { name: 'Connect' })).toBeVisible();
});

test('renders footer explore links', async ({ page }) => {
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Our Chapters' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'What We Do' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Events', exact: true })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Join Us' })).toBeVisible();
});

test('renders footer support links', async ({ page }) => {
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'Volunteer' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Donate' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Sponsors' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Chat support' })).toBeVisible();
});

test('renders footer social media links', async ({ page }) => {
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'Facebook' }).first()).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Twitter' }).first()).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Instagram' }).first()).toBeVisible();
  await expect(footer.getByRole('link', { name: 'LinkedIn' }).first()).toBeVisible();
  await expect(footer.getByRole('link', { name: 'YouTube' }).first()).toBeVisible();
});

// Test case for Theme Toggle
test('toggles theme on button click', async ({ page }) => {
  const button = page.getByRole('button', { name: /switch to (light|dark) mode/i });
  await expect(button).toBeVisible();

  const htmlBefore = await page.locator('html').getAttribute('class');
  await button.click();
  const htmlAfter = await page.locator('html').getAttribute('class');

  expect(htmlAfter).not.toBe(htmlBefore);
});

test('renders footer legal links', async ({ page }) => {
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'Terms and Conditions' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
});

