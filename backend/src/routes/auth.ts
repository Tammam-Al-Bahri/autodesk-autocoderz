import { Router } from "express";
import { login, logout, me, test } from "../handlers/auth";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.get("/test", requireAuth, test);

export default router;
