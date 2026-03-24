import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createBooking } from "../handlers/booking";

const router = Router();

router.post("/bookings", requireAuth, createBooking);

export default router;