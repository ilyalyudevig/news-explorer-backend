// playwright.config.js
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/api",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3001",
  },
});
