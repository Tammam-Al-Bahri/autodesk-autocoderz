import { Router } from "express";
import { createBooking } from "../handlers/booking";

const router = Router();

router.post("/bookings", createBooking);

export default router;