/**
 * One-time migration script — converts legacy Booking documents where
 * `listing` is stored as a plain title string to the correct ObjectId
 * reference introduced in the schema update.
 *
 * Usage:
 *   node Backend/init/migrateBookings.js
 *
 * Safe to re-run — skips bookings that already hold an ObjectId.
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Listing = require("../models/listing");

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected.");

    // Fetch every booking — we need to inspect the raw `listing` value
    // before Mongoose casts it, so we query without the model's schema cast.
    const collection = mongoose.connection.collection("bookings");
    const rawBookings = await collection.find({}).toArray();

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const booking of rawBookings) {
      const raw = booking.listing;

      // Already an ObjectId — nothing to do.
      if (raw instanceof mongoose.Types.ObjectId || mongoose.Types.ObjectId.isValid(raw) && typeof raw !== "string") {
        skipped++;
        continue;
      }

      // Plain string title — look up the matching Listing.
      if (typeof raw === "string") {
        const listing = await Listing.findOne({ title: raw }).select("_id");
        if (!listing) {
          console.warn(`  ✗ No listing found for title: "${raw}" (booking ${booking._id})`);
          failed++;
          continue;
        }

        await collection.updateOne(
          { _id: booking._id },
          { $set: { listing: listing._id } }
        );
        console.log(`  ✓ Migrated booking ${booking._id}: "${raw}" → ${listing._id}`);
        migrated++;
        continue;
      }

      skipped++;
    }

    console.log(`\nDone — ${migrated} migrated, ${skipped} skipped, ${failed} failed.`);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

migrate();
