const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getPreferences,updatePreferences } = require("../controllers/preferenceController");

const preferenceRouter = express.Router();
preferenceRouter.get("/preferences",authMiddleware, getPreferences);
preferenceRouter.put("/preferences",authMiddleware, updatePreferences);

module.exports = preferenceRouter;
