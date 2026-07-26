import { sql } from "drizzle-orm";
import { db } from "../db/index.js";

export async function connectDB(): Promise<void> {
  await db.execute(sql`SELECT 1`);
  console.log("PostgreSQL connected");
}
