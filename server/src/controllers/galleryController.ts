import { asc, eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { galleries } from "../db/schema.js";
import {
  galleryImageSchema,
  galleryResponseSchema,
  landingImageResponseSchema,
  slugSchema
} from "../schemas.js";
import type {
  GalleryImage,
  GalleryRecord,
  GalleryResponse,
  LandingImageResponse
} from "../types/index.js";

interface LandingImagePayload {
  id: number;
  title: string;
  slug: string;
  description: string;
  landingImage: GalleryImage;
}

function toGalleryResponse(gallery: GalleryRecord): GalleryResponse {
  return galleryResponseSchema.parse({
    ...gallery,
    createdAt: gallery.createdAt.toISOString(),
    updatedAt: gallery.updatedAt.toISOString()
  });
}

function toLandingImageResponse(gallery: LandingImagePayload): LandingImageResponse {
  return landingImageResponseSchema.parse({
    id: gallery.id.toString(),
    title: gallery.title,
    slug: gallery.slug,
    description: gallery.description,
    src: gallery.landingImage.src,
    alt: gallery.landingImage.alt,
    caption: gallery.landingImage.caption
  });
}

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

    const images: LandingImageResponse[] = rows.map((gallery) => {
      const landingImage = galleryImageSchema.parse(gallery.landingImage);

      return toLandingImageResponse({
        ...gallery,
        landingImage
      });
    });

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

    const galleryResponses: GalleryResponse[] = rows.map((gallery) =>
      toGalleryResponse(gallery)
    );

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
    const slugResult = slugSchema.safeParse(request.params.slug.toLowerCase());

    if (!slugResult.success) {
      response.status(400).json({
        message: "Invalid gallery slug."
      });
      return;
    }

    const slug = slugResult.data;
    const [gallery] = await db
      .select()
      .from(galleries)
      .where(eq(galleries.slug, slug))
      .limit(1);

    if (!gallery) {
      response.status(404).json({
        message: "Gallery not found."
      });
      return;
    }

    response.json(toGalleryResponse(gallery));
  } catch (error) {
    next(error);
  }
}
