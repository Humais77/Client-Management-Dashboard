import "dotenv/config";

import dns from "node:dns";

import app from "./app";
import { connectDatabase } from "./config/db";

// Use public DNS servers for MongoDB Atlas SRV resolution.
dns.setServers([
  "1.1.1.1",
  "8.8.8.8",
]);

const PORT = Number(
  process.env.PORT || 5000
);

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error(
    "Failed to start server:",
    error
  );

  process.exit(1);
});