import { Router } from "express";
import { login, logout, me } from "../handlers/auth";
import { requireAuth } from "../middleware/auth";
import { authBase, authRoutes } from "@autocoderz/shared";

const router = Router();

router.post(`${authBase}${authRoutes.login}`, login);
router.post(`${authBase}${authRoutes.logout}`, logout);
router.get(`${authBase}${authRoutes.me}`, requireAuth, me);

export default router;
