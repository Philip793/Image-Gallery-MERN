export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface LandingImage {
  id: string;
  title: string;
  slug: string;
  description: string;
  src: string;
  alt: string;
  caption: string;
}

export interface Gallery {
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

export type LoadStatus = "loading" | "success" | "error";
