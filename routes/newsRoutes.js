const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getNews,
  markRead,
  markFavorite,
  getReadArticles,
  getFavorites,
  searchNews,
} = require("../controllers/newsController");

const router = express.Router();

router.get("/", auth, getNews);
router.post("/:id/read", auth, markRead);
router.post("/:id/favorite", auth, markFavorite);
router.get("/read", auth, getReadArticles);
router.get("/favorites", auth, getFavorites);
router.get("/search/:keyword", auth, searchNews);

module.exports = router;
