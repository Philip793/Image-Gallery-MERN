import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../app.js";
import { connectDB } from "../config/db.js";
import { closeDb } from "../db/index.js";

describe("gallery API", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await connectDB();
  });

  afterAll(async () => {
    await closeDb();
  });

  it("returns all galleries as JSON-safe API payloads", async () => {
    const response = await request(app).get("/api/galleries");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const firstGallery = response.body[0];

    expect(firstGallery).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      slug: expect.any(String),
      description: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });

    expect(new Date(firstGallery.createdAt).toString()).not.toBe("Invalid Date");
    expect(new Date(firstGallery.updatedAt).toString()).not.toBe("Invalid Date");
    expect(firstGallery.images.length).toBeGreaterThan(0);
  });

  it("returns the health endpoint status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      database: "connected"
    });
  });

  it("returns the landing gallery images with the flattened shape", async () => {
    const response = await request(app).get("/api/galleries/landing");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const firstImage = response.body[0];
    expect(firstImage).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      slug: expect.any(String),
      description: expect.any(String),
      src: expect.any(String),
      alt: expect.any(String),
      caption: expect.any(String)
    });
  });

  it("returns a 400 for an invalid gallery slug", async () => {
    const response = await request(app).get("/api/galleries/Bad%20Slug");

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "Invalid gallery slug."
    });
  });

  it("returns a 404 for a missing gallery", async () => {
    const response = await request(app).get("/api/galleries/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      message: "Gallery not found."
    });
  });

  it("returns JSON for an unknown API endpoint", async () => {
    const response = await request(app).get("/api/unknown");

    expect(response.status).toBe(404);
    expect(response.header["content-type"]).toContain("application/json");
    expect(response.body).toMatchObject({
      message: "API endpoint not found."
    });
  });
});
