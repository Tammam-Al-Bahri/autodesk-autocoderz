import { Router } from "express";
import { validate } from "../lib/validate";
import { createBuildingGroupSchema, buildingGroupsBase } from "@autocoderz/shared";
import { requireAuth } from "../middleware/auth";
import { createBuildingGroup, getBuildingGroups } from "../handlers/buildingGroups";

const router = Router();

router.post(
    `${buildingGroupsBase}`,
    requireAuth,
    validate(createBuildingGroupSchema),
    createBuildingGroup,
);
router.get(`${buildingGroupsBase}`, requireAuth, getBuildingGroups);

export default router;
