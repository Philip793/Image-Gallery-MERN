import { asc, eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { galleries } from "../db/schema.js";
import type {
  GalleryResponse,
  LandingImageResponse
} from "../types/index.js";

export async function getLandingImages(
  _request: Request,
  response: Response<LandingImageResponse[]>,
  next: NextFunction
): Promise<void> {
  try {
    const rows = await db
      .select({
        id: galleries.id,
        title: galleries.title,
        slug: galleries.slug,
        description: galleries.description,
        landingImage: galleries.landingImage
      })
      .from(galleries)
      .orderBy(asc(galleries.featuredOrder), asc(galleries.title));

    const images: LandingImageResponse[] = rows.map((gallery) => ({
      id: gallery.id.toString(),
      title: gallery.title,
      slug: gallery.slug,
      description: gallery.description,
      src: gallery.landingImage.src,
      alt: gallery.landingImage.alt,
      caption: gallery.landingImage.caption
    }));

    response.json(images);
  } catch (error) {
    next(error);
  }
}

export async function getAllGalleries(
  _request: Request,
  response: Response<GalleryResponse[]>,
  next: NextFunction
): Promise<void> {
  try {
    const rows = await db
      .select()
      .from(galleries)
      .orderBy(asc(galleries.featuredOrder), asc(galleries.title));

    const galleryResponses: GalleryResponse[] = rows.map((gallery) => ({
      ...gallery,
      createdAt: gallery.createdAt.toISOString(),
      updatedAt: gallery.updatedAt.toISOString()
    }));

    response.json(galleryResponses);
  } catch (error) {
    next(error);
  }
}

export async function getGalleryBySlug(
  request: Request<{ slug: string }>,
  response: Response<GalleryResponse | { message: string }>,
  next: NextFunction
): Promise<void> {
  try {
    const [gallery] = await db
      .select()
      .from(galleries)
      .where(eq(galleries.slug, request.params.slug.toLowerCase()))
      .limit(1);

    if (!gallery) {
      response.status(404).json({
        message: "Gallery not found."
      });
      return;
    }

    const galleryResponse: GalleryResponse = {
      ...gallery,
      createdAt: gallery.createdAt.toISOString(),
      updatedAt: gallery.updatedAt.toISOString()
    };

    response.json(galleryResponse);
  } catch (error) {
    next(error);
  }
}
