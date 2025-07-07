import { test, expect } from "@playwright/test";
import mongoose from "mongoose";
import Article from "../../models/article";
import User from "../../models/user";

let authToken;
let user;

test.beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

test.afterAll(async () => {
  await mongoose.disconnect();
});

test.beforeEach(async ({ request }) => {
  // Create a user and get a token for authenticated requests
  const userResponse = await request.post("/signup", {
    data: {
      email: `test-${Date.now()}@example.com`,
      password: "password123",
      name: "Test User",
    },
  });

  const userData = await userResponse.json();
  user = userData.user;

  const loginResponse = await request.post("/signin", {
    data: {
      email: user.email,
      password: "password123",
    },
  });
  const loginData = await loginResponse.json();
  authToken = loginData.token;
});


test.afterEach(async () => {
  await Article.deleteMany({});
  await User.deleteMany({});
});

test.describe("Article API", () => {
  test("should create a new article", async ({ request }) => {
    const response = await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        source: "Test Source",
        title: "Test Article",
        content: "This is a test article.",
        url: "https://example.com/test",
        urlToImage: "https://example.com/test.jpg",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });
    expect(response.status()).toBe(201);
    const json = await response.json();
    expect(json).toHaveProperty("title", "Test Article");
  });
});
