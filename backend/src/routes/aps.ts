import { Router } from "express";
import { getApsViewerToken, getUploadTokenHandler } from "../handlers/aps";
import { apsRoutes } from "@autocoderz/shared";

const router = Router();

router.get(apsRoutes.viewerToken, getApsViewerToken);
router.get(apsRoutes.uploadToken, getUploadTokenHandler);

export default router;
