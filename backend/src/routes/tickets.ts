import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { ticketsBase } from "@autocoderz/shared";
import {
    getTickets,
    createTicket,
    updateTicket,
} from "../handlers/tickets";

// actually remembered to use the shared constants here unlike the rooms file lol

const router = Router();

router.get(ticketsBase, requireAuth, getTickets); // add filters for priority or status later if we have time
router.post(ticketsBase, requireAuth, createTicket);
router.patch(ticketsBase, requireAuth, updateTicket); // only really using patch to update the status to resolved for now

export default router;

// requireauth on everything because i don't want random people making junk tickets lol