import "dotenv/config";
import type { Server } from "http";
import { connectDB } from "./config/db.js";
import { closeDb } from "./db/index.js";
import { app } from "./app.js";

const port = Number(process.env.PORT) || 5000;
let httpServer: Server | undefined;
let isShuttingDown = false;

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
