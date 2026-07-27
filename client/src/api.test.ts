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

  it("passes the abort signal to fetch", async () => {
    const controller = new AbortController();

    const fetchMock = vi.fn(
      (_url: string, init?: globalThis.RequestInit) =>
        new Promise<never>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(
              new DOMException("The operation was aborted.", "AbortError")
            );
          });
        })
    );

    globalThis.fetch = fetchMock as typeof fetch;

    const request = getLandingImages(controller.signal);
    controller.abort();

    await expect(request).rejects.toMatchObject({
      name: "AbortError"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/galleries/landing"),
      expect.objectContaining({
        signal: controller.signal
      })
    );
  });
});
