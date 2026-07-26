import "dotenv/config";
import { connectDB } from "./config/db.js";
import { closeDb, db } from "./db/index.js";
import { galleries as galleriesTable } from "./db/schema.js";
import { galleries as seedGalleries } from "./data/galleries.js";

async function seedDatabase(): Promise<void> {
  try {
    await connectDB();

    await db.delete(galleriesTable);
    await db.insert(galleriesTable).values(seedGalleries);

    console.log(`Seeded ${seedGalleries.length} galleries.`);
  } catch (error) {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
}

void seedDatabase();
