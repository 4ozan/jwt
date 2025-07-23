import express from "express";
import { verifyToken } from "../auth/auth";
import type { JWTPayload } from "../auth/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) : void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
 res.status(401).json({ error: "Access token required" });
 return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
  res.status(403).json({ error: "Invalid or expired token" });
  return;
  }

  req.user = decoded;
  next();
};