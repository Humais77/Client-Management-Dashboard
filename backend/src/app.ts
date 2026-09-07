import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import clientRoutes from "./routes/client.routes";
import projectRoutes from "./routes/project.routes";
import { errorHandler } from "./middleware/error.middleware";
import { requireAuth } from "./middleware/auth.middleware";
const app = express();
const frontendUrl =
  process.env.FRONTEND_URL;
app.use(
  helmet()
);

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
  })
);

app.use(
  express.json({
    limit: "1mb"
  })
);

app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },
});

app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "NexManage API is running"
  });
});

app.use(
  "/api/auth",
  authLimiter,
  authRoutes
);

app.use(
  "/api/clients",
  requireAuth,
  clientRoutes
);

app.use(
  "/api/projects",
  requireAuth,
  projectRoutes
);

app.use(errorHandler);

export default app;