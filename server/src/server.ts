import "dotenv/config";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response
} from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";
import { connectDB } from "./config/db.js";
import { db } from "./db/index.js";
import { galleryRouter } from "./routes/galleryRoutes.js";
import type { ApiError } from "./types/index.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

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

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
}

void startServer();
