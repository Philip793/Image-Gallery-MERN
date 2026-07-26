import { Router } from "express";
import {
  getAllGalleries,
  getGalleryBySlug,
  getLandingImages
} from "../controllers/galleryController.js";

export const galleryRouter = Router();

galleryRouter.get("/landing", getLandingImages);
galleryRouter.get("/", getAllGalleries);
galleryRouter.get("/:slug", getGalleryBySlug);
