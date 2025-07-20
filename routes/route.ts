import express from "express"
import { signup,Login, profile } from "../controllers/controllers"

const router = express.Router()
router.post("/api/auth/signup", signup)
router.post("/api/auth/login", Login)
router.get("/api/profile", profile)

export default router;