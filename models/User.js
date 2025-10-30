const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    preferences: {
      type: [String],
      default: [],
    },
    readArticles: [
      {
        articleId: String,
        article: Object,
        readAt: { type: Date, default: Date.now },
      },
    ],
    favoriteArticles: [
      {
        articleId: String,
        article: Object,
        favoritedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
