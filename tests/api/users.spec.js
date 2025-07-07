import { test, expect } from "@playwright/test";
import mongoose from "mongoose";
import User from "../../models/user";

test.beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

test.afterAll(async () => {
  await mongoose.disconnect();
});

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
    expect(json.user.email).toBe("test@example.com");
  });
});
