const User = require("../models/User");
const getPreferences = async (req, res) => {
  try {
    const userId = req.user;
    const details = await User.findById(userId).select("preferences");
    res.status(200).json({ preferences: details.preferences });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// const updatePreferences = async (req, res) => {
//   try {
//     const { preferences } = req.body;
//     const user = await User.findById(req.user);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.preferences = preferences;
//     await user.save();
//     res.status(200).json({ message: "Preferences updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    if (!Array.isArray(preferences) || preferences.some(p => typeof p !== "string")) {
      return res.status(400).json({ message: "Preferences must be an array of strings" });
    }
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.preferences = preferences;
    await user.save();

    res.status(200).json({ message: "Preferences updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = { getPreferences, updatePreferences };
