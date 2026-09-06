import { Request, Response } from "express";
import { User } from "../models/User";
import {
  signupSchema,
  loginSchema
} from "../schemas/auth.schema";
import {
  hashPassword,
  comparePassword
} from "../utils/password";
import { generateToken } from "../utils/jwt";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export async function signup(
  req: Request,
  res: Response
): Promise<void> {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: parsed.error.flatten()
    });

    return;
  }

  const { name, email, password } = parsed.data;

  const existingUser = await User.findOne({
    email
  });

  if (existingUser) {
    res.status(409).json({
      success: false,
      message: "Email is already registered"
    });

    return;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = generateToken(user.id);

  res
    .cookie("token", token, cookieOptions)
    .status(201)
    .json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
}

export async function login(
  req: Request,
  res: Response
): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid email or password"
    });

    return;
  }

  const { email, password } = parsed.data;

  const user = await User
    .findOne({ email })
    .select("+password");

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });

    return;
  }

  const passwordValid = await comparePassword(
    password,
    user.password
  );

  if (!passwordValid) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });

    return;
  }

  const token = generateToken(user.id);

  res
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
}

export function logout(
  _req: Request,
  res: Response
): void {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax"
  });

  res.json({
    success: true,
    message: "Logged out successfully"
  });
}

export async function me(
  req: Request,
  res: Response
): Promise<void> {
  const user = await User.findById(req.userId)
    .select("-password");

  if (!user) {
    res.status(401).json({
      success: false,
      message: "User not found"
    });

    return;
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}