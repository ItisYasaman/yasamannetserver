// server/app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const tagsRouter = require("./routes/tags"); // Import the tags router
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://yasblog.netlify.app",
      "https://yasblog.netlify.app/login"
    ],
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use('/tags', tagsRouter); // Use the tags router

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
