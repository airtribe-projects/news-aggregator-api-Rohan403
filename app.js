const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const preferenceRouter = require("./routes/preferenceRoute.js");
const newsRoutes = require("./routes/newsRoutes");
const app = express();
dotenv.config();
const port = process.env.PORT || 8000;

app.use(express.json());
//connect to database
connectDB();
//routes
app.use("/users", authRoutes, preferenceRouter);
app.use("/news", newsRoutes);
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
