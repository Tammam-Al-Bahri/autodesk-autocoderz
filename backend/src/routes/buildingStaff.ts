// I'm literally losing track of where these routes actually go because of the shared constants lol
import { Router } from "express";
import { buildingStaffBase, buildingStaffRoutes,  } from "@autocoderz/shared";
import { requireAuth } from "../middleware/auth";
import { getStaffBuildings, manageInvite , removeStaffMember} from "../handlers/buildingStaff";

const router = Router();

// this should return all buildings where the current logged in user is a staff member
router.get(`${buildingStaffBase}`, requireAuth, getStaffBuildings);
// using patch here since we're just flipping the status enum accepted or declined
router.patch(`${buildingStaffBase}${buildingStaffRoutes.manageInvite}`, requireAuth, manageInvite);

router.delete(`${buildingStaffBase}/:id`, requireAuth, removeStaffMember);

export default router;

// maybe add something like a specific middleware to check if the staffId actually belongs to the user or just handle it in the handler