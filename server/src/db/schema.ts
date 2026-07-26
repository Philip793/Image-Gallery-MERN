import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import type { GalleryImage } from "../types/index.js";

export const galleries = pgTable("galleries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  featuredOrder: integer("featured_order").notNull().default(0),
  landingImage: jsonb("landing_image").$type<GalleryImage>().notNull(),
  images: jsonb("images").$type<GalleryImage[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
});
