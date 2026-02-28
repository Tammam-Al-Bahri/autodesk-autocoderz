import { Router } from "express";
import { validate } from "../lib/validate";
import { createBuildingSchema, buildingsRoutes, buildingsBase } from "@autocoderz/shared";
import { requireAuth } from "../middleware/auth";
import { createBuilding, getBuildings, uploadBuildingModel } from "../handlers/buildings";
import { upload } from "../lib/uploadFile";

const router = Router();

router.get(`${buildingsBase}`, requireAuth, getBuildings);
router.post(`${buildingsBase}`, requireAuth, validate(createBuildingSchema), createBuilding);
router.post(
    `${buildingsBase}${buildingsRoutes.upload}`,
    requireAuth,
    upload.single("file"),
    uploadBuildingModel,
);

export default router;
