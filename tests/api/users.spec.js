import { test, expect } from "@playwright/test";
import { setup, teardown } from "./test-setup";
import User from "../../models/user";

test.beforeAll(setup);
test.afterAll(teardown);
test.afterEach(async () => {
  await User.deleteMany({});
});

test.describe("User API", () => {
  test("should register a new user", async ({ request }) => {
    const response = await request.post("/signup", {
      data: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      },
    });
    expect(response.status()).toBe(201);
    const json = await response.json();
    expect(json).toHaveProperty("user.email", "test@example.com");
  });
});
