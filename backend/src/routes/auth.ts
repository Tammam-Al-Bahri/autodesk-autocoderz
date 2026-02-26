import { Router } from "express";
import { login, logout, me } from "../handlers/auth";
import { requireAuth } from "../middleware/auth";
import { authRoutes } from "@autocoderz/shared";

const router = Router();

router.post(authRoutes.login, login);
router.post(authRoutes.logout, logout);
router.get(authRoutes.me, requireAuth, me);

export default router;
