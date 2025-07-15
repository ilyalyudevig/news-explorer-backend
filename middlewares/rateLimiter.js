const { rateLimit } = require("express-rate-limit");

const { NODE_ENV } = process.env;
const limit = NODE_ENV === "staging" ? 500 : 100;

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
