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

  test("should get all articles for a user", async ({ request }) => {
    // Create a couple of articles
    await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        source: "Test Source 1",
        title: "Test Article 1",
        content: "This is a test article 1.",
        url: "https://example.com/test1",
        urlToImage: "https://example.com/test1.jpg",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });

    await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        source: "Test Source 2",
        title: "Test Article 2",
        content: "This is a test article 2.",
        url: "https://example.com/test2",
        urlToImage: "https://example.com/test2.jpg",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });

    // Get all articles
    const response = await request.get("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.length).toBe(2);
  });

  test("should delete an article", async ({ request }) => {
    // Create an article
    const createArticleResponse = await request.post("/articles", {
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
    const article = await createArticleResponse.json();

    // Delete the article
    const deleteResponse = await request.delete(`/articles/${article._id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(deleteResponse.status()).toBe(200);

    // Verify the article is deleted
    const getResponse = await request.get("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const articles = await getResponse.json();
    expect(articles.length).toBe(0);
  });

  test("should not create an article without a token", async ({ request }) => {
    const response = await request.post("/articles", {
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
    expect(response.status()).toBe(401);
  });

  test("should not delete an article without a token", async ({ request }) => {
    // Create an article first to have something to try and delete
    const createArticleResponse = await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        source: "Test Source",
        title: "Test Article to Delete",
        content: "This is a test article to delete.",
        url: "https://example.com/delete",
        urlToImage: "https://example.com/delete.jpg",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });
    const article = await createArticleResponse.json();

    // Attempt to delete without a token
    const deleteResponse = await request.delete(`/articles/${article._id}`);
    expect(deleteResponse.status()).toBe(401);
  });

  test("should not delete another user's article", async ({ request }) => {
    // Create an article with the first user
    const createArticleResponse = await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        source: "Test Source Other User",
        title: "Test Article Other User",
        content: "This is another user's article.",
        url: "https://example.com/other",
        urlToImage: "https://example.com/other.jpg",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });
    const article = await createArticleResponse.json();

    // Create a second user
    const secondUserEmail = `seconduser-${Date.now()}@example.com`;
    await request.post("/signup", {
      data: {
        email: secondUserEmail,
        password: "password456",
        name: "Second User",
      },
    });

    // Log in the second user to get their token
    const loginResponse = await request.post("/signin", {
      data: {
        email: secondUserEmail,
        password: "password456",
      },
    });
    const secondUserAuthToken = (await loginResponse.json()).token;

    // Attempt to delete the first user's article with the second user's token
    const deleteResponse = await request.delete(`/articles/${article._id}`, {
      headers: {
        Authorization: `Bearer ${secondUserAuthToken}`,
      },
    });
    expect(deleteResponse.status()).toBe(403);
  });

  test("should not create an article with missing source", async ({ request }) => {
    const response = await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        title: "Test Article",
        content: "This is a test article.",
        url: "https://example.com/test",
        urlToImage: "https://example.com/test.jpg",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not create an article with missing title", async ({ request }) => {
    const response = await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        source: "Test Source",
        content: "This is a test article.",
        url: "https://example.com/test",
        urlToImage: "https://example.com/test.jpg",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not create an article with missing content", async ({ request }) => {
    const response = await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        source: "Test Source",
        title: "Test Article",
        url: "https://example.com/test",
        urlToImage: "https://example.com/test.jpg",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not create an article with missing url", async ({ request }) => {
    const response = await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        source: "Test Source",
        title: "Test Article",
        content: "This is a test article.",
        urlToImage: "https://example.com/test.jpg",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not create an article with missing urlToImage", async ({ request }) => {
    const response = await request.post("/articles", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        source: "Test Source",
        title: "Test Article",
        content: "This is a test article.",
        url: "https://example.com/test",
        keywords: ["testing"],
        publishedAt: new Date().toISOString(),
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not create an article with missing keywords", async ({ request }) => {
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
        publishedAt: new Date().toISOString(),
      },
    });
    expect(response.status()).toBe(400);
  });

  test("should not create an article with missing publishedAt", async ({ request }) => {
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
      },
    });
    expect(response.status()).toBe(400);
  });
});
