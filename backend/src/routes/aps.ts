import { Router } from "express";
import { getApsViewerToken } from "../handlers/aps";
import { apsRoutes } from "@autocoderz/shared";

const router = Router();

router.get(apsRoutes.viewerToken, getApsViewerToken);

export default router;
