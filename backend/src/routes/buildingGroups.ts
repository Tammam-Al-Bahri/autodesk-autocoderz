import { Router } from "express";
import { validate } from "../lib/validate";
import { createBuildingGroupSchema, buildingGroupsBase } from "@autocoderz/shared";
import { requireAuth } from "../middleware/auth";
import {
    createBuildingGroup,
    deleteBuildingGroup,
    getBuildingGroups,
    updateBuildingGroup,
} from "../handlers/buildingGroups";

const router = Router();

router.post(
    `${buildingGroupsBase}`,
    requireAuth,
    validate(createBuildingGroupSchema),
    createBuildingGroup,
);
router.get(`${buildingGroupsBase}`, requireAuth, getBuildingGroups);

// change these to use something like /:id in the path instead of query params later dont want lose marks for not being proper rest lol
router.delete(`${buildingGroupsBase}`, requireAuth, deleteBuildingGroup);
router.patch(
    `${buildingGroupsBase}`,
    requireAuth,
    validate(createBuildingGroupSchema), // using the create schema here cos we haven't made an update schema yet
    updateBuildingGroup,
);

export default router;
