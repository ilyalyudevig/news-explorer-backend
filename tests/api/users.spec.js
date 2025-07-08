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
    const email = `test-${Date.now()}@example.com`;
    const response = await request.post("/signup", {
      data: {
        email,
        password: "password123",
        name: "Test User",
      },
    });
    expect(response.status()).toBe(201);
    const json = await response.json();
    expect(json.user.email).toBe(email);
  });

  test("should log in a registered user", async ({ request }) => {
    const email = `testlogin-${Date.now()}@example.com`;
    // First, register a user
    await request.post("/signup", {
      data: {
        email,
        password: "password123",
        name: "Test User",
      },
    });

    // Now, log in with the same credentials
    const response = await request.post("/signin", {
      data: {
        email,
        password: "password123",
      },
    });
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty("token");
  });

  test("should not log in with incorrect password", async ({ request }) => {
    const email = `testlogin-${Date.now()}@example.com`;
    // First, register a user
    await request.post("/signup", {
      data: {
        email,
        password: "password123",
        name: "Test User",
      },
    });

    // Now, try to log in with the wrong password
    const response = await request.post("/signin", {
      data: {
        email,
        password: "wrongpassword",
      },
    });
    expect(response.status()).toBe(401);
  });

  test("should not log in with a non-existent email", async ({ request }) => {
    const response = await request.post("/signin", {
      data: {
        email: `nonexistent-${Date.now()}@example.com`,
        password: "password123",
      },
    });
    expect(response.status()).toBe(401);
  });

  test("should get current user info", async ({ request }) => {
    const email = `testuser-${Date.now()}@example.com`;
    const name = "Test User";

    // First, register a user
    await request.post("/signup", {
      data: {
        email,
        password: "password123",
        name,
      },
    });

    // Log in to get a token
    const loginResponse = await request.post("/signin", {
      data: {
        email,
        password: "password123",
      },
    });
    const { token } = await loginResponse.json();

    // Get user info
    const response = await request.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.email).toBe(email);
    expect(json.name).toBe(name);
  });

  test("should not get user info without a token", async ({ request }) => {
    const response = await request.get("/users/me");
    expect(response.status()).toBe(401);
  });

  test("should not register a user with missing email", async ({ request }) => {
    const response = await request.post("/signup", {
      data: {
        password: "password123",
        name: "Test User",
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not register a user with invalid email format", async ({ request }) => {
    const response = await request.post("/signup", {
      data: {
        email: "invalid-email",
        password: "password123",
        name: "Test User",
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not register a user with missing password", async ({ request }) => {
    const response = await request.post("/signup", {
      data: {
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not register a user with a short password", async ({ request }) => {
    const response = await request.post("/signup", {
      data: {
        email: `test-${Date.now()}@example.com`,
        password: "short",
        name: "Test User",
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not register a user with missing name", async ({ request }) => {
    const response = await request.post("/signup", {
      data: {
        email: `test-${Date.now()}@example.com`,
        password: "password123",
      },
    });
    expect(response.status()).toBe(400);
  });
});
