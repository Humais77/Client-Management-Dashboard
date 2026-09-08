import { Request, Response, NextFunction } from "express";

const protectedMethods = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
]);

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!protectedMethods.has(req.method)) {
    next();
    return;
  }

  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    res.status(500).json({
      success: false,
      message: "Server security configuration is missing"
    });

    return;
  }

  const origin = req.headers.origin;

  if (!origin || origin !== frontendUrl) {
    res.status(403).json({
      success: false,
      message: "Forbidden request origin"
    });

    return;
  }

  next();
}