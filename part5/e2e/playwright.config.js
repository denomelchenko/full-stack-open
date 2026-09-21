const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  // The material lowers the default timeouts to three seconds: a failing test
  // must fail fast, because the whole suite shares one database.
  timeout: 3000,
  // The tests share one MongoDB database, so they must never run in parallel.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // Every request in the specs and in the "request" fixture is relative to
    // this URL. The Vite dev server proxies /api to http://localhost:3003.
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Firefox and WebKit are deliberately disabled:
    //  1. the whole suite shares one MongoDB database, so "workers: 1" and a
    //     single browser project are what keep it deterministic;
    //  2. on this host Firefox and WebKit need system libraries (libnss3,
    //     libasound2, libgbm1, ...) that are not installed and cannot be
    //     installed without root - the material's own install output shows
    //     exactly this problem.
    // The material documents the two workarounds: comment the projects out
    // here, or keep them and run "playwright test --project=chromium".
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
})
