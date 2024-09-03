import { Router } from "express";
import { login, logout, refreshAccessToken, signup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/refresh-token", refreshAccessToken);

export default router;