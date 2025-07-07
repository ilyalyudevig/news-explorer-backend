import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/api",
  timeout: 30000,
  globalSetup: "./tests/api/global-setup.js",
  globalTeardown: "./tests/api/global-teardown.js",
  use: {
    baseURL: process.env.BASE_URL,
  },
});
