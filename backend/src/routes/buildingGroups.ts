import { Router } from "express";
import { validate } from "../lib/validate";
import { createBuildingGroupSchema, buildingGroupsRoutes } from "@autocoderz/shared";
import { requireAuth } from "../middleware/auth";
import { createBuildingGroup } from "../handlers/buildingGroups";

const router = Router();

router.post(
    buildingGroupsRoutes.root,
    requireAuth,
    validate(createBuildingGroupSchema),
    createBuildingGroup,
);

export default router;
