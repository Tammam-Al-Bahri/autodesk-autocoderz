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
    deleteTicket,
    createGuestTicket
} from "../handlers/tickets";

const router = Router();

// --- PUBLIC ROUTES (No login required) ---

// This allows guests to report from the portal using their Booking ID
router.post(
    `${ticketsBase}/guest`, 
    createGuestTicket
);


// --- MANAGER ROUTES (Login required) ---

// Get all tickets for the dashboard
router.get(
    `${ticketsBase}`, 
    requireAuth, 
    getTickets
);

// Create a ticket manually as a manager
router.post(
    `${ticketsBase}`, 
    requireAuth, 
    validate(createTicketSchema), 
    createTicket
);

// Update status
router.patch(
    `${ticketsBase}`, 
    requireAuth, 
    validate(updateTicketSchema), 
    updateTicket
);

// Delete a ticket
router.delete(
    `${ticketsBase}`, 
    requireAuth, 
    deleteTicket
);

export default router;