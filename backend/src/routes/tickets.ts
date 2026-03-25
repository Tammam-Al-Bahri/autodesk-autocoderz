import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { ticketsBase } from "@autocoderz/shared";
import {
    getTickets,
    createTicket,
    updateTicket,
} from "../handlers/tickets";

const router = Router();

router.get(ticketsBase, requireAuth, getTickets);
router.post(ticketsBase, requireAuth, createTicket);
router.patch(ticketsBase, requireAuth, updateTicket);

export default router;