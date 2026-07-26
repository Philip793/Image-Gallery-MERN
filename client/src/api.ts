import type { Gallery, LandingImage } from "./types";

interface RequestOptions {
  signal?: AbortSignal;
}

interface ErrorBody {
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
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

  return response.json() as Promise<T>;
}

export function getLandingImages(
  signal?: AbortSignal
): Promise<LandingImage[]> {
  return request<LandingImage[]>("/galleries/landing", { signal });
}

export function getGallery(
  slug: string,
  signal?: AbortSignal
): Promise<Gallery> {
  return request<Gallery>(`/galleries/${encodeURIComponent(slug)}`, {
    signal
  });
}
