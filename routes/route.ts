import express from "express";
import { signup, Login, profile, refreshToken, logout } from "../controllers/controllers";
import { authenticateToken } from "../middlewares/middleware";

const router = express.Router();

router.post("/api/auth/signup", signup);
router.post("/api/auth/login", Login);
router.get("/api/profile", authenticateToken, profile);
router.post("/api/auth/refresh", refreshToken);
router.post("/api/auth/logout", logout);

export default router;