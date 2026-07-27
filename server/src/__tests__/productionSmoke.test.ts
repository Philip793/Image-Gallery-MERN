import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const projectRoot = path.resolve(currentDirectory, "../../..");
const serverEntry = path.resolve(projectRoot, "server/dist/server.js");

async function waitForServer(port: number, timeoutMs = 10000): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await globalThis.fetch(`http://127.0.0.1:${port}/api/health`);

      if (response.ok) {
        return;
      }
    } catch {
      // Server is still coming up.
    }

    await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
  }

  throw new Error(`Server did not start on port ${port} in time.`);
}

describe("production smoke", () => {
  let child: ReturnType<typeof spawn> | undefined;

  beforeAll(async () => {
    child = spawn("node", [serverEntry], {
      cwd: projectRoot,
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: "5010",
        DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/cylinder_gallery"
      },
      stdio: ["ignore", "pipe", "pipe"]
    });

    child.stdout?.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    child.stderr?.on("data", (chunk) => {
      process.stderr.write(chunk);
    });

    await waitForServer(5010);
  }, 20000);

  afterAll(async () => {
    if (!child) {
      return;
    }

    const activeChild = child;
    activeChild.kill("SIGTERM");

    const exited = await Promise.race([
      new Promise<boolean>((resolve) => {
        activeChild.once("exit", () => resolve(true));
      }),
      new Promise<boolean>((resolve) => {
        globalThis.setTimeout(() => resolve(false), 5_000);
      })
    ]);

    if (!exited && activeChild.exitCode === null) {
      activeChild.kill("SIGKILL");
    }
  });

  it("serves the landing page and gallery route in production mode", async () => {
    const landingResponse = await globalThis.fetch("http://127.0.0.1:5010/");
    expect(landingResponse.status).toBe(200);
    const landingHtml = await landingResponse.text();
    expect(landingHtml).toContain("<div id=\"root\">");

    const galleryResponse = await globalThis.fetch("http://127.0.0.1:5010/gallery/coastlines");
    expect(galleryResponse.status).toBe(200);
    const galleryHtml = await galleryResponse.text();
    expect(galleryHtml).toContain("<div id=\"root\">");
  });
});
