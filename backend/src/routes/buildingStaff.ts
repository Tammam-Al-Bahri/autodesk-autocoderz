import { Router } from "express";
import { buildingStaffBase, buildingStaffRoutes } from "@autocoderz/shared";
import { requireAuth } from "../middleware/auth";
import { getStaffBuildings, manageInvite } from "../handlers/buildingStaff";

const router = Router();

router.get(`${buildingStaffBase}`, requireAuth, getStaffBuildings);
router.patch(`${buildingStaffBase}${buildingStaffRoutes.manageInvite}`, requireAuth, manageInvite);

export default router;
