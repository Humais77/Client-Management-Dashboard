import "dotenv/config";

import app from "./app";
import { connectDatabase } from "./config/db";

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