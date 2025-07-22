import express from "express";
import { signup, Login, profile } from "../controllers/controllers";
import { authenticateToken } from "../middlewares/middleware";

const router = express.Router();

// Public routes
router.post("/api/auth/signup", signup);
router.post("/api/auth/login", Login);

// Protected routes (require authentication)
router.get("/api/profile", authenticateToken, profile);

export default router;