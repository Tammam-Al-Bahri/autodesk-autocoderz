import { Router } from "express";
import { getAutodeskToken } from "../handlers/autodesk";
import { requireAuth } from "../middleware/auth";
import { authRoutes } from "@autocoderz/shared";

const router = Router();

router.get(authRoutes.autodesk, requireAuth, getAutodeskToken);

export default router;
