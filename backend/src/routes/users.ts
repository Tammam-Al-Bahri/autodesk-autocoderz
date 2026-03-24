import { Router } from "express";
import { createUser, getUsers, getBuildingStaff } from "../handlers/users";
import { requireAuth } from "../middleware/auth";
import { usersBase, usersRoutes } from "@autocoderz/shared";

const router = Router();

router.get(`${usersBase}${usersRoutes.getUsers}`, requireAuth, getUsers);
router.get(`${usersBase}/buildings/:buildingId/staff`, requireAuth, getBuildingStaff);
router.post(`${usersBase}${usersRoutes.createUser}`, createUser);

export default router;