import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { getGallery, getLandingImages } from "./api";

vi.mock("./api", () => ({
  getLandingImages: vi.fn(),
  getGallery: vi.fn()
}));

const mockedGetLandingImages = vi.mocked(getLandingImages);
const mockedGetGallery = vi.mocked(getGallery);

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    })) as typeof window.matchMedia;
  });

  it("shows an error state when landing images fail to load", async () => {
    mockedGetLandingImages.mockRejectedValueOnce(new Error("Network down"));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load the galleries"
    );
    expect(screen.getByText("Network down")).toBeInTheDocument();
  });

  it("links cylinder cards to the correct gallery slug", async () => {
    mockedGetLandingImages.mockResolvedValueOnce([
      {
        id: "1",
        title: "Coastline",
        slug: "coastline",
        description: "Ocean views",
        src: "https://example.com/coastline.jpg",
        alt: "Coastline",
        caption: ""
      }
    ]);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const link = await screen.findByRole("link", { name: /open the coastline gallery/i });
    expect(link).toHaveAttribute("href", "/gallery/coastline");
  });

  it("navigates from the landing page to the gallery page", async () => {
    const user = userEvent.setup();

    mockedGetLandingImages.mockResolvedValueOnce([
      {
        id: "1",
        title: "Coastline",
        slug: "coastline",
        description: "Ocean views",
        src: "https://example.com/coastline.jpg",
        alt: "Coastline",
        caption: ""
      }
    ]);

    mockedGetGallery.mockResolvedValueOnce({
      id: 1,
      title: "Coastline",
      slug: "coastline",
      description: "Ocean views",
      featuredOrder: 1,
      landingImage: {
        src: "https://example.com/coastline.jpg",
        alt: "Coastline",
        caption: ""
      },
      images: [
        {
          src: "https://example.com/coastline-1.jpg",
          alt: "Coastline 1",
          caption: ""
        }
      ],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    await user.click(
      await screen.findByRole("link", { name: /open the coastline gallery/i })
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Coastline" })).toBeInTheDocument();
    });
  });
});
