const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  sourceName: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
  },
  urlToImage: {
    type: String,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  keywords: [{ type: String }],
});

module.exports = mongoose.model("article", articleSchema);
