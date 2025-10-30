const axios = require("axios");
const User = require("../models/User");
const client = require("../config/redis");

const CACHE_TTL = 1800; // 30 minutes

const getNews = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("preferences");
    if (!user) return res.status(404).json({ message: "User not found" });
    // Get user preferences
    if (!Array.isArray(user.preferences) || user.preferences.length === 0) {
      return res.status(400).json({ message: "No valid preferences found" });
    }
    const query = user.preferences.join(" OR ");
    const cacheKey = `news:${query}`;
    // ✅ Check Cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      return res
        .status(200)
        .json({ news: JSON.parse(cachedData), cached: true });
    }
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&apiKey=${process.env.SECRET_API_KEY}`;
    const response = await axios.get(newsApiUrl);
    await client.set(cacheKey, JSON.stringify(response.data.articles), { EX: CACHE_TTL });
    if (!response.data || !response.data.articles)
      return res.status(502).json({ message: "Failed to fetch news" });
    if (!response.data || !response.data.articles) {
      return res.status(502).json({ message: "Failed to fetch news" });
    }
    // return articles
    res.status(200).json({
      message: "News fetched successfully",
      news: response.data.articles,
      cached: false,
    });
  } catch (error) {
    console.error("News fetch error:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const markRead = async (req, res) => {
  try {
    const userId = req.user;
    const article = req.body; // full article object
    const articleId = req.params.id;
    const user = await User.findById(userId);
    const alreadyExists = user.readArticles.some(a => a.articleId === articleId);
    if (!alreadyExists) {
      user.readArticles.push({ articleId, article });
      await user.save();
    }

    res.status(200).json({ message: "Article marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markFavorite = async (req, res) => {
  const userId = req.user;
  const { id } = req.params;

  await User.findByIdAndUpdate(userId, { $addToSet: { favoriteArticles: id } });

  res.status(200).json({ message: "Article added to favorites" });
};
const getReadArticles = async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);
  res.status(200).json({ read: user.readArticles });
};

const getFavorites = async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);
  res.status(200).json({ favorites: user.favoriteArticles });
};

const searchNews = async (req, res) => {
  try {
    const { keyword } = req.params;

    const cacheKey = `search:${keyword}`;
    const cached = await client.get(cacheKey);

    if (cached) {
      return res.status(200).json({ news: JSON.parse(cached), cached: true });
    }

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      keyword
    )}&apiKey=${process.env.SECRET_API_KEY}`;
    const response = await axios.get(url);
    const articles = response.data.articles || [];

    await client.set(cacheKey, JSON.stringify(articles), { EX: 1800 });

    res.status(200).json({ news: articles, cached: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNews,
  markRead,
  markFavorite,
  getReadArticles,
  getFavorites,
  searchNews,
};
