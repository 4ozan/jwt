import express from "express";
import { signup, Login, profile } from "../controllers/controllers";
import { authenticateToken } from "../middlewares/middleware";

const router = express.Router();

router.post("/api/auth/signup", signup);
router.post("/api/auth/login", Login);
router.get("/api/profile", authenticateToken, profile);

export default router;