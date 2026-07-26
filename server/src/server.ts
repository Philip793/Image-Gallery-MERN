import "dotenv/config";
import cors from "cors";
import { sql } from "drizzle-orm";
import express, {
  type NextFunction,
  type Request,
  type Response
} from "express";
import type { Server } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { closeDb, db } from "./db/index.js";
import { galleryRouter } from "./routes/galleryRoutes.js";
import type { ApiError } from "./types/index.js";

export const app = express();
const port = Number(process.env.PORT) || 5000;
let httpServer: Server | undefined;
let isShuttingDown = false;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

app.use(express.json({ limit: "1mb" }));

app.get(
  "/api/health",
  async (_request: Request, response: Response, next: NextFunction) => {
    try {
      await db.execute(sql`SELECT 1`);

      response.json({
        status: "ok",
        database: "connected"
      });
    } catch (error) {
      next(error);
    }
  }
);

app.use("/api/galleries", galleryRouter);

app.use("/api", (_request: Request, response: Response) => {
  response.status(404).json({
    message: "API endpoint not found."
  });
});

if (process.env.NODE_ENV === "production") {
  const clientDirectory = path.resolve(
    currentDirectory,
    "../../client/dist"
  );

  app.use(express.static(clientDirectory));

  app.get("*", (_request: Request, response: Response) => {
    response.sendFile(path.join(clientDirectory, "index.html"));
  });
}

app.use(
  (
    error: ApiError,
    _request: Request,
    response: Response,
    _next: NextFunction
  ) => {
    console.error(error);

    response.status(error.status || 500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected server error occurred."
          : error.message || "An unexpected server error occurred."
    });
  }
);

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down.`);

  if (!httpServer) {
    try {
      await closeDb();
      process.exit(0);
    } catch (shutdownError) {
      console.error("Database shutdown error:", shutdownError);
      process.exit(1);
    }

    return;
  }

  httpServer.close(async (error) => {
    try {
      await closeDb();

      if (error) {
        console.error("HTTP shutdown error:", error);
        process.exit(1);
      }

      process.exit(0);
    } catch (shutdownError) {
      console.error("Database shutdown error:", shutdownError);
      process.exit(1);
    }
  });
}

export async function startServer(): Promise<void> {
  try {
    await connectDB();

    httpServer = app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  void startServer();
}
