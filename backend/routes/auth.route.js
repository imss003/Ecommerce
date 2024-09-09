import { Router } from "express";
import { getProfile, login, logout, refreshAccessToken, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/refresh-token", refreshAccessToken);

router.get("/profile", protectRoute, getProfile);

export default router;