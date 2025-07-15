const { test, expect } = require("@playwright/test");

test.describe("Testing API", () => {
  test("should reset the database", async ({ request }) => {
    const response = await request.post("/testing/reset-user");
    expect(response.status()).toBe(204);
  });
});
