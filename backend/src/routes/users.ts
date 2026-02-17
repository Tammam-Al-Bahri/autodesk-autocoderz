import { Router } from "express";
import { createUser, getUsers } from "../handlers/users";
import { validate } from "../lib/validate";
import { createUserSchema } from "../schemas/user";

const router = Router();

// /api/users
router.get("/", getUsers);
router.post("/", validate(createUserSchema), createUser);

export default router;
