import { z } from "zod";
import { buildingId } from "./building.js";
import { userId } from "./user.js";

export const ticketId = z.cuid().brand<"ticketId">();
export type TicketId = z.infer<typeof ticketId>;


export const ticketStatus = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]);
export type TicketStatus = z.infer<typeof ticketStatus>;

export const ticketPriority = z.enum(["LOW", "MED", "HIGH"]);
export type TicketPriority = z.infer<typeof ticketPriority>;

export const ticketFormSchema = z.object({
    buildingId,
    roomId: z.string().cuid().optional(),
    issue: z
        .string()
        .min(10, { message: "Issue description must be at least 10 characters" })
        .max(1000, { message: "Issue description must be at most 1000 characters" }),
    priority: ticketPriority.default("LOW"),
});

export type TicketForm = z.infer<typeof ticketFormSchema>;

export const createTicketSchema = z.object({
    body: ticketFormSchema.extend({
        authorId: userId.optional(),
    }),
});

export type CreateTicket = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = z.object({
    body: z.object({
        id: ticketId,
        status: ticketStatus.optional(),
        priority: ticketPriority.optional(),
        issue: z.string().min(10).optional(),
    }),
});

export type UpdateTicket = z.infer<typeof updateTicketSchema>;

export const ticketSchema = ticketFormSchema.extend({
    id: ticketId,
    status: ticketStatus,
    authorId: userId,
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Ticket = z.infer<typeof ticketSchema>;