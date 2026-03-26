import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createBooking } from "../handlers/booking";

const router = Router();

router.post("/bookings", requireAuth, createBooking);

// router.get("/bookings", requireAuth, getBookings); // build this today if we got time
// router.delete("/bookings/:id", requireAuth, cancelBooking); // need to figure out cancellation logic before doing this

export default router;