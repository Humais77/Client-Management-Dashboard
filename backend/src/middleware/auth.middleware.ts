import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required"
    });

    return;
  }

  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired session"
    });

    return;
  }

  const user = await User.exists({
    _id: payload.userId
  });

  if (!user) {
    res.clearCookie("token");

    res.status(401).json({
      success: false,
      message: "User session is no longer valid"
    });

    return;
  }

  req.userId = payload.userId;

  next();
}