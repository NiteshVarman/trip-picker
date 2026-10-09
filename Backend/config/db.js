const mongoose = require("mongoose");
const initDB = require("../init/index.js");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB is connected");

    // Only wipe and re-seed listings when explicitly requested.
    // Set SEED_DB=true in your .env to seed on startup (development only).
    if (process.env.SEED_DB === "true") {
      console.log("SEED_DB=true — seeding database...");
      await initDB();
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = { connectDB };