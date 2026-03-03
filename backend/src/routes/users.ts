import { Router } from "express";
import { createUser, getUsers } from "../handlers/users";
import { validate } from "../lib/validate";
import { createUserSchema, usersBase, usersRoutes } from "@autocoderz/shared";

const router = Router();

// /api/users
router.get(`${usersBase}${usersRoutes.getUsers}`, getUsers);
router.post(`${usersBase}${usersRoutes.createUser}`, validate(createUserSchema), createUser);

export default router;
