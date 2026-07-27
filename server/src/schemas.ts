import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug must not be empty.")
  .max(100, "Slug is too long.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase letters, numbers, and hyphens only."
  );

export const galleryImageSchema = z.object({
  src: z.string().trim().url("Image source must be a valid URL."),
  alt: z.string().trim().min(1, "Alt text is required.").max(160),
  caption: z.string().trim().max(240).default("")
});

export const galleryResponseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1, "Title is required."),
  slug: slugSchema,
  description: z.string().trim().min(1, "Description is required."),
  featuredOrder: z.number().int().nonnegative(),
  landingImage: galleryImageSchema,
  images: z.array(galleryImageSchema).min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const landingImageResponseSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Title is required."),
  slug: slugSchema,
  description: z.string().trim().min(1, "Description is required."),
  src: z.string().trim().url("Image source must be a valid URL."),
  alt: z.string().trim().min(1, "Alt text is required.").max(160),
  caption: z.string().trim().max(240).default("")
});

