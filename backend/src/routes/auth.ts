import { Router } from "express";
import {
    login,
    logout,
    me,
    getUploadProgress,
    forgotPassword,
    resetPassword,
} from "../handlers/auth";
import { requireAuth } from "../middleware/auth";
import {
    authBase,
    authRoutes,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "@autocoderz/shared";
import { validate } from "../lib/validate";

// keeping auth routes separate so the main app file doesn't get massive (like the ninja meme lol)
const router = Router();

// router.post('/api/auth/login', login); // hardcoded way
router.post(`${authBase}${authRoutes.login}`, login);
router.post(`${authBase}${authRoutes.logout}`, logout);
router.get(`${authBase}${authRoutes.me}`, requireAuth, me);

// maybe add something that limits this so someone doesn't spam the resend API and use all the free tier
router.post(
    `${authBase}${authRoutes.forgotPassword}`,
    validate(forgotPasswordSchema),
    forgotPassword,
);
router.post(`${authBase}${authRoutes.resetPassword}`, validate(resetPasswordSchema), resetPassword);

// does this actually need the requireauth leaving it for now just to be safe
router.get(`${authBase}${authRoutes.uploadProgress}`, requireAuth, getUploadProgress);

export default router;
