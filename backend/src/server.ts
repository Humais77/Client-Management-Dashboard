import "dotenv/config";

import mongoose from "mongoose";

import app from "./app";
import { connectDatabase } from "./config/db";
import { validateEnv } from "./config/env";

validateEnv();

const PORT = Number(process.env.PORT || 5000);

async function startServer(): Promise<void> {
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  async function shutdown(signal: string): Promise<void> {
    console.log(`${signal} received. Shutting down...`);

    server.close(async () => {
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
        process.exit(0);
      } catch (error) {
        console.error(
          "Error while closing MongoDB connection:",
          error
        );
        process.exit(1);
      }
    });
  }

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});