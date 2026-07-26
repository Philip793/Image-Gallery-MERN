import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { connectDB } from "../config/db.js";
import { closeDb } from "../db/index.js";
import { app } from "../server.js";

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
  });

  it("returns a gallery by slug", async () => {
    const response = await request(app).get("/api/galleries/coastlines");

    expect(response.status).toBe(200);
    expect(response.body.slug).toBe("coastlines");
    expect(response.body.images[0]).toMatchObject({
      src: expect.any(String),
      alt: expect.any(String),
      caption: expect.any(String)
    });
  });
});
