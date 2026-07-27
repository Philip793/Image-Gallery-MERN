import { afterEach, describe, expect, it, vi } from "vitest";
import { getGallery, getLandingImages } from "./api";

const originalFetch = globalThis.fetch;

describe("api client", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("parses a valid landing-page response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "1",
          title: "Coastline",
          slug: "coastline",
          description: "Ocean views",
          src: "https://example.com/coastline.jpg",
          alt: "Coastline",
          caption: ""
        }
      ]
    }) as typeof fetch;

    const result = await getLandingImages();

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("coastline");
  });

  it("rejects invalid gallery data with zod", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        title: "Coastline",
        slug: "Bad Slug",
        description: "Ocean views",
        featuredOrder: 0,
        landingImage: {
          src: "https://example.com/coastline.jpg",
          alt: "Coastline",
          caption: ""
        },
        images: []
      })
    }) as typeof fetch;

    await expect(getGallery("coastline")).rejects.toThrow();
  });

  it("uses a non-JSON error message when the API fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => {
        throw new Error("not json");
      }
    }) as typeof fetch;

    await expect(getLandingImages()).rejects.toThrow("Request failed with status 503.");
  });

  it("extracts the API error message when provided", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: "Bad request" })
    }) as typeof fetch;

    await expect(getLandingImages()).rejects.toThrow("Bad request");
  });

  it("supports request cancellation", async () => {
    const abortError = new DOMException("The operation was aborted.", "AbortError");

    globalThis.fetch = vi.fn().mockImplementation((_url: string, init?: globalThis.RequestInit) => {
      const signal = init?.signal;
      signal?.throwIfAborted();
      return Promise.reject(abortError);
    }) as typeof fetch;

    await expect(getLandingImages(new AbortController().signal)).rejects.toThrow(
      "The operation was aborted."
    );
  });
});
