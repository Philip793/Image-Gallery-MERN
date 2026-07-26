import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: true,
      trim: true
    },
    alt: {
      type: String,
      required: true,
      trim: true
    },
    caption: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    _id: false
  }
);

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    featuredOrder: {
      type: Number,
      default: 0
    },
    landingImage: {
      type: imageSchema,
      required: true
    },
    images: {
      type: [imageSchema],
      required: true,
      validate: {
        validator(images) {
          return Array.isArray(images) && images.length > 0;
        },
        message: "A gallery must contain at least one image."
      }
    }
  },
  {
    timestamps: true
  }
);

export const Gallery = mongoose.model("Gallery", gallerySchema);
