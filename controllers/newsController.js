const axios = require("axios");
const User = require("../models/User");


const getNews = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Get user preferences
    const preferences = user.preferences;
    if (preferences.length === 0)
      return res.status(400).json({ message: "No preferences set" });
    const query = preferences.join(" OR ");
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&apiKey=${process.env.SECRET_API_KEY}`;
    const response = await axios.get(newsApiUrl);
    if (!response.data || !response.data.articles)
      return res.status(502).json({ message: "Failed to fetch news" });
    if (!response.data || !response.data.articles) {
      return res.status(502).json({ message: "Failed to fetch news" });
    }
    // return articles
    res.status(200).json({
      message: "News fetched successfully",
      news: response.data.articles,
    });
  } catch (error) {
    console.error("News fetch error:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = { getNews };
