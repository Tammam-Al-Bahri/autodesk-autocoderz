import { Router } from "express";
import { validate } from "../lib/validate";
import {
    createBuildingSchema,
    buildingsRoutes,
    buildingsBase,
    createBuildingStaffInviteSchema,
} from "@autocoderz/shared";
import { requireAuth } from "../middleware/auth";
import {
    createBuilding,
    createBuildingStaffInvite,
    getBuildings,
    uploadBuildingModel,
    getBuildingStaff,
    updateBuilding,
    deleteBuilding,
} from "../handlers/buildings";
import { upload } from "../lib/uploadFile";

const router = Router();

router.get(`${buildingsBase}`, requireAuth, getBuildings);
router.get(`${buildingsBase}${buildingsRoutes.staff}`, requireAuth, getBuildingStaff);
router.post(`${buildingsBase}`, requireAuth, validate(createBuildingSchema), createBuilding);
router.post(
    `${buildingsBase}${buildingsRoutes.upload}`,
    requireAuth,
    upload.single("file"),
    uploadBuildingModel,
);
router.post(
    `${buildingsBase}${buildingsRoutes.invite}`,
    requireAuth,
    validate(createBuildingStaffInviteSchema),
    createBuildingStaffInvite,
);
router.delete(`${buildingsBase}`, requireAuth, deleteBuilding);
router.patch(`${buildingsBase}`, requireAuth, validate(createBuildingSchema), updateBuilding);

export default router;
