const mongoose = require("mongoose");
const validator = require("validator");

const articleSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Please enter a valid URL",
    },
  },
  urlToImage: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Please enter a valid URL",
    },
  },
  publishedAt: {
    type: String,
    required: true,
  },
  keywords: [{ type: String, required: true }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("article", articleSchema);
