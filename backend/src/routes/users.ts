// I'm actually giving up on being consistent with these constants now it's just taking too long lol

import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { usersBase, usersRoutes } from "@autocoderz/shared";
import { 
    createUser, 
    getUsers, 
    getBuildingStaff, 
    acceptStaffInvite, 
    getCurrentUser,
    getMyTaskHistory
} from "../handlers/users";

const router = Router();

router.get(`${usersBase}${usersRoutes.getUsers}`, requireAuth, getUsers);
router.post(`${usersBase}${usersRoutes.createUser}`, createUser); // No requireauth here obviously or no one could ever register lol

// this path is getting way too long might need to nest this under a buildings router instead
router.get(`${usersBase}/buildings/:buildingId/staff`, requireAuth, getBuildingStaff);

router.post("/users/buildings/accept", requireAuth, acceptStaffInvite); // using hardcoded strings again because i can't remember what I named the constant in the shared folder

router.get("/users/me", requireAuth, getCurrentUser); // calling this me because it's what everyone else seems to do in tutorials
router.get("/users/me/task-history", requireAuth, getMyTaskHistory);

export default router;