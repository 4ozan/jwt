import jwt from "jsonwebtoken";
import { z } from "zod";

const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

export interface JWTPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export function generateToken(userId: number, email: string): string | null {
  const emailResponse = emailSchema.safeParse(email);
  
  if (!emailResponse.success) {
    return null;
  }

  const payload: JWTPayload = {
    userId,
    email,
  };

  try {
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    return null;
  }
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}


export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function validatePassword(password: string): boolean {
  const result = passwordSchema.safeParse(password);
  return result.success;
}

export function validateEmail(email: string): boolean {
  const result = emailSchema.safeParse(email);
  return result.success;
}
