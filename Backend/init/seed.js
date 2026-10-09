/**
 * One-time seed script — run locally to populate the production database.
 *
 * Usage:
 *   node Backend/init/seed.js
 *
 * Reads MONGO_URL from Backend/.env so it targets whatever DB is configured
 * there (production Atlas in this case). Safe to re-run — it clears and
 * re-inserts listings each time.
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./tourpackages");

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected.");

    console.log("Clearing existing listings...");
    await Listing.deleteMany({});

    console.log("Inserting seed data...");
    await Listing.insertMany(initData.data);

    const count = await Listing.countDocuments();
    console.log(`Done — ${count} listings inserted.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seed();
