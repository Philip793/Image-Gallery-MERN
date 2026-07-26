import { Gallery } from "../models/Gallery.js";

export async function getLandingImages(_request, response, next) {
  try {
    const galleries = await Gallery.find({})
      .sort({ featuredOrder: 1, title: 1 })
      .select("title slug description landingImage")
      .lean();

    const images = galleries.map((gallery) => ({
      id: gallery._id.toString(),
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

export async function getAllGalleries(_request, response, next) {
  try {
    const galleries = await Gallery.find({})
      .sort({ featuredOrder: 1, title: 1 })
      .lean();

    response.json(galleries);
  } catch (error) {
    next(error);
  }
}

export async function getGalleryBySlug(request, response, next) {
  try {
    const gallery = await Gallery.findOne({
      slug: request.params.slug.toLowerCase()
    }).lean();

    if (!gallery) {
      return response.status(404).json({
        message: "Gallery not found."
      });
    }

    return response.json(gallery);
  } catch (error) {
    return next(error);
  }
}
