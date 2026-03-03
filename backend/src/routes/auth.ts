import { Router } from "express";
import { login, logout, me, getUploadProgress } from "../handlers/auth";
import { requireAuth } from "../middleware/auth";
import { authBase, authRoutes } from "@autocoderz/shared";

const router = Router();

router.post(`${authBase}${authRoutes.login}`, login);
router.post(`${authBase}${authRoutes.logout}`, logout);
router.get(`${authBase}${authRoutes.me}`, requireAuth, me);
router.get(`${authBase}${authRoutes.uploadProgress}`, requireAuth, getUploadProgress);

export default router;
