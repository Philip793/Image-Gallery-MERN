import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { galleries } from "./data/galleries.js";
import { Gallery } from "./models/Gallery.js";

async function seedDatabase() {
  try {
    await connectDB();

    await Gallery.deleteMany({});
    await Gallery.insertMany(galleries);

    console.log(`Seeded ${galleries.length} galleries.`);
  } catch (error) {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
