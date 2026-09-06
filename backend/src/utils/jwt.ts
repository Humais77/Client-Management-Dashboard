import jwt from "jsonwebtoken";

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

export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    getJwtSecret(),
    {
      expiresIn: "7d"
    }
  );
}

export function verifyToken(
  token: string
): JwtPayload | null {
  try {
    return jwt.verify(
      token,
      getJwtSecret()
    ) as JwtPayload;
  } catch {
    return null;
  }
}