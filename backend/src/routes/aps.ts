import { Router } from "express";
import { getApsViewerToken } from "../handlers/aps";
import { apsBase, apsRoutes } from "@autocoderz/shared";

const router = Router();

router.get(`${apsBase}${apsRoutes.viewerToken}`, getApsViewerToken);

export default router;
