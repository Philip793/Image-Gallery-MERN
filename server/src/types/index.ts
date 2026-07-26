import type { InferSelectModel } from "drizzle-orm";
import type { galleries } from "../db/schema.js";

export type GalleryRecord = InferSelectModel<typeof galleries>;

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface GallerySeed {
  title: string;
  slug: string;
  description: string;
  featuredOrder: number;
  landingImage: GalleryImage;
  images: GalleryImage[];
}

export interface LandingImageResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  src: string;
  alt: string;
  caption: string;
}

export interface GalleryResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  featuredOrder: number;
  landingImage: GalleryImage;
  images: GalleryImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiError extends Error {
  status?: number;
}
