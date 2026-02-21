import { Router } from "express";
import { getAutodeskToken } from "../handlers/autodesk";
import { authRoutes } from "@autocoderz/shared";

const router = Router();

router.get(authRoutes.autodesk, getAutodeskToken);

export default router;
