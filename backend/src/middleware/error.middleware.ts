import {
  Request,
  Response,
  NextFunction,
} from "express";
import mongoose from "mongoose";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(error);

  if (
    error instanceof mongoose.Error.ValidationError
  ) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(error.errors).map(
        (item) => item.message
      ),
    });

    return;
  }

  if (
    error instanceof mongoose.Error.CastError
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid resource ID",
    });

    return;
  }

  if (
    error instanceof Error &&
    error.name === "MongoServerError"
  ) {
    const mongoError =
      error as Error & {
        code?: number;
      };

    if (mongoError.code === 11000) {
      res.status(409).json({
        success: false,
        message:
          "A record with this information already exists.",
      });

      return;
    }
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Internal server error",
  });
}