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
router.post(`${usersBase}${usersRoutes.createUser}`, createUser);

router.get(`${usersBase}/buildings/:buildingId/staff`, requireAuth, getBuildingStaff);

router.post("/users/buildings/accept", requireAuth, acceptStaffInvite);

router.get("/users/me", requireAuth, getCurrentUser);
router.get("/users/me/task-history", requireAuth, getMyTaskHistory);

export default router;