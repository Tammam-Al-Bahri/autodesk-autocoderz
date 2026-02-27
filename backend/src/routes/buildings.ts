import { Router } from "express";
import { validate } from "../lib/validate";
import { createBuildingSchema, buildingsRoutes, buildingGroupId } from "@autocoderz/shared";
import { requireAuth } from "../middleware/auth";
import { createBuilding, getBuildings } from "../handlers/buildings";

const router = Router();

router.post(buildingsRoutes.root, requireAuth, validate(createBuildingSchema), createBuilding);
router.get(buildingsRoutes.root, requireAuth, getBuildings);

export default router;
