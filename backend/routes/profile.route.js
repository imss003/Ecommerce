import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUserProfile, updateProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/my-profile", protectRoute, getUserProfile);

router.post("/my-profile", protectRoute, updateProfile);

export default router;