import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: 3000,
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
}
