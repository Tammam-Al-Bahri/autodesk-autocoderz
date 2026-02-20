import { Router } from "express";
import { createUser, getUsers } from "../handlers/users";
import { validate } from "../lib/validate";
import { createUserSchema, usersRoutes } from "@autocoderz/shared";

const router = Router();

// /api/users
router.get(usersRoutes.getUsers, getUsers);
router.post(usersRoutes.createUser, validate(createUserSchema), createUser);

export default router;
