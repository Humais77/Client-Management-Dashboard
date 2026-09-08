import jwt, {
  JwtPayload as JsonWebTokenPayload
} from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export function generateToken(
  userId: string
): string {
  return jwt.sign(
    { userId },
    getJwtSecret(),
    {
      expiresIn: "7d",
      algorithm: "HS256"
    }
  );
}

export function verifyToken(
  token: string
): JwtPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      getJwtSecret(),
      {
        algorithms: ["HS256"]
      }
    );

    if (
      typeof decoded === "string" ||
      !decoded ||
      typeof decoded !== "object"
    ) {
      return null;
    }

    const payload =
      decoded as JsonWebTokenPayload & {
        userId?: unknown;
      };

    if (typeof payload.userId !== "string") {
      return null;
    }

    return {
      userId: payload.userId
    };
  } catch {
    return null;
  }
}