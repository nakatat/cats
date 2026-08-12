import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const apiBaseURL = process.env.E2E_API_BASE_URL ?? 'http://localhost:8081/api';
const apiURL = new URL(apiBaseURL);
const apiPort = process.env.E2E_API_PORT ?? (apiURL.port || '8081');
const webPort = new URL(baseURL).port || '3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'mvn -f ../api/pom.xml spring-boot:run',
      url: `${apiBaseURL}/health`,
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        ...process.env,
        DATABASE_URL: process.env.E2E_DATABASE_URL ?? process.env.DATABASE_URL,
        SERVER_PORT: apiPort,
      },
    },
    {
      command: `pnpm exec next dev --webpack --hostname 0.0.0.0 --port ${webPort}`,
      url: baseURL,
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        ...process.env,
        API_BASE_URL: apiBaseURL,
        DEFAULT_TEAM_SLUG: 'cats',
        NEXT_PUBLIC_SITE_URL: baseURL,
      },
    },
  ],
});
