import { z } from "zod";
import { gallerySchema, landingImageSchema } from "./schemas";
import type { Gallery, LandingImage } from "./types";

interface RequestOptions {
  signal?: AbortSignal;
}

interface ErrorBody {
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(
  endpoint: string,
  options: RequestOptions = {}
): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    signal: options.signal
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const errorBody = (await response.json()) as ErrorBody;

      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // The response was not JSON, so use the default message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getLandingImages(
  signal?: AbortSignal
): Promise<LandingImage[]> {
  const payload = await request("/galleries/landing", { signal });
  return z.array(landingImageSchema).parse(payload);
}

export async function getGallery(
  slug: string,
  signal?: AbortSignal
): Promise<Gallery> {
  const payload = await request(`/galleries/${encodeURIComponent(slug)}`, {
    signal
  });

  return gallerySchema.parse(payload);
}
