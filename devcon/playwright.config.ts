import { defineConfig, devices } from '@playwright/test';

/**
 * Ports (TEST-01).
 *
 * The suite runs the site twice, because its two halves are different
 * situations rather than different pages:
 *
 * - `3000` — no `PORTAL_API_KEY`. The portal is absent, and every section falls
 *   back to its bundled content. This is what CI has always tested.
 * - `3100` — pointed at the fixture portal on `3999`, which returns officers,
 *   events and images. This is the site a visitor gets once the portal has
 *   content, and until now it was only ever checked by hand.
 */
const FALLBACK_PORT = 3000;
const PORTAL_PORT = 3100;
const FIXTURE_PORT = 3999;
const FIXTURE_API_KEY = 'fixture-key';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  timeout: 60000,
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    /**
     * The data path, on its own server. One browser is enough: what it covers
     * is decided on the server, so a second browser would re-render the same
     * HTML rather than test anything new.
     */
    {
      name: 'portal-data',
      testMatch: /portal-data\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PORTAL_PORT}` },
    },

    {
      name: 'chromium',
      testIgnore: /portal-data\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testIgnore: /portal-data\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testIgnore: /portal-data\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers (local only). */
    ...(!process.env.CI ? [
      {
        name: 'Microsoft Edge',
        testIgnore: /portal-data\.spec\.ts/,
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
      },
      {
        name: 'Google Chrome',
        testIgnore: /portal-data\.spec\.ts/,
        use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      },
    ] : []),
  ],

  /*
   * Three servers: the fixture portal, the site without a portal, and the site
   * with one. Playwright starts them together; the second app waits for the
   * first one's build rather than running its own, because two builds writing
   * `.next` at once corrupt each other.
   */
  webServer: [
    {
      command: 'node tests/fixtures/portal-fixture.mjs',
      url: `http://localhost:${FIXTURE_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      env: { PORT: String(FIXTURE_PORT), FIXTURE_API_KEY },
    },
    {
      command: 'npm run build && npm run start',
      url: `http://localhost:${FALLBACK_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    },
    {
      /*
       * A real build, not the other server on a second port: the homepage is
       * prerendered, so a build made without the portal configured serves its
       * fallback HTML whatever the runtime environment says. `NEXT_DIST_DIR`
       * keeps the two builds out of each other's way.
       */
      /*
       * The dist directory is removed first. Next keeps its fetch cache there,
       * and the portal fetch is cached for 30 minutes — so a rebuild after a
       * change to the fixture would otherwise serve the previous payload, and
       * the suite would be testing data nobody is serving any more. That cost an
       * hour once already.
       */
      command:
        `node -e "require('fs').rmSync('.next-portal',{recursive:true,force:true})" && npx next build && npx next start -p ${PORTAL_PORT}`,
      url: `http://localhost:${PORTAL_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 600_000,
      env: {
        NEXT_DIST_DIR: '.next-portal',
        PORTAL_API_BASE_URL: `http://localhost:${FIXTURE_PORT}`,
        PORTAL_API_KEY: FIXTURE_API_KEY,
      },
    },
  ],
});
