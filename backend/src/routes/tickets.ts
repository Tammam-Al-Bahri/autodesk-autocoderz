import { Router } from "express";
import { validate } from "../lib/validate";
import { requireAuth } from "../middleware/auth";
import { 
    ticketsBase, 
    createTicketSchema, 
    updateTicketSchema 
} from "@autocoderz/shared";
import {
    getTickets,
    createTicket,
    updateTicket,
    deleteTicket
} from "../handlers/tickets";

const router = Router();

router.get(
    `${ticketsBase}`, 
    requireAuth, 
    getTickets
);

router.post(
    `${ticketsBase}`, 
    requireAuth, 
    validate(createTicketSchema), 
    createTicket
);

router.patch(
    `${ticketsBase}`, 
    requireAuth, 
    validate(updateTicketSchema), 
    updateTicket
);

router.delete(
    `${ticketsBase}`, 
    requireAuth, 
    deleteTicket
);

export default router;