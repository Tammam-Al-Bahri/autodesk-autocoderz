import { Router } from "express";
import { buildingStaffBase } from "@autocoderz/shared";
import { requireAuth } from "../middleware/auth";
import { getStaffBuildings } from "../handlers/buildingStaff";

const router = Router();

router.get(`${buildingStaffBase}`, requireAuth, getStaffBuildings);

export default router;
