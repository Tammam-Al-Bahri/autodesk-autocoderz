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

const router = Router();

router.post(`${authBase}${authRoutes.login}`, login);
router.post(`${authBase}${authRoutes.logout}`, logout);
router.get(`${authBase}${authRoutes.me}`, requireAuth, me);

router.post(
    `${authBase}${authRoutes.forgotPassword}`,
    validate(forgotPasswordSchema),
    forgotPassword,
);
router.post(`${authBase}${authRoutes.resetPassword}`, validate(resetPasswordSchema), resetPassword);

router.get(`${authBase}${authRoutes.uploadProgress}`, requireAuth, getUploadProgress);

export default router;
