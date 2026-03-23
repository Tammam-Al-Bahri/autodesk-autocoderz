import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * GET: Retrieve tickets.
 * Optionally filters by buildingGroupId if provided in the query string.
 */
export const getTickets = async (req: Request, res: Response) => {
    try {
        const { buildingGroupId } = req.query;

        const tickets = await (prisma.ticket as any).findMany({
            where: buildingGroupId ? {
                building: {
                    buildingGroupId: String(buildingGroupId)
                }
            } : undefined,
            include: {
                building: true,
                room: true,
                author: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedTickets = tickets.map((t: any) => ({
            id: t.id,
            hotel: t.building?.name || "Unknown Property",
            room: t.room?.number || "N/A",
            issue: t.issue,
            status: t.status === "RESOLVED" ? "Resolved" : t.status === "IN_PROGRESS" ? "In Progress" : "Open",
            time: new Date(t.createdAt).toLocaleDateString('en-GB'), 
            priority: t.priority?.charAt(0) + t.priority?.slice(1).toLowerCase() || "Low",
        }));

        res.json({ data: formattedTickets });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ error: { title: "Could not retrieve tickets" } });
    }
};

/**
 * POST: Create a new maintenance ticket.
 * Utilises the authenticated user's ID as the author.
 */
export const createTicket = async (req: Request, res: Response) => {
    try {
        const { buildingId, roomId, issue, priority } = req.body;
        const authorId = (req as any).user?.id; 

        if (!authorId) {
            return res.status(401).json({ error: { title: "Unauthorized: User session not found" } });
        }

        const newTicket = await (prisma.ticket as any).create({
            data: {
                buildingId,
                roomId: roomId || null,
                authorId,
                issue,
                priority: priority || "LOW",
                status: "OPEN",
            }
        });

        res.status(201).json({ data: newTicket });
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ error: { title: "Failed to create ticket" } });
    }
};

/**
 * PATCH: Update an existing ticket (e.g., changing status to Resolved).
 */
export const updateTicket = async (req: Request, res: Response) => {
    try {
        const { id, status, priority, issue } = req.body;

        if (!id) {
            return res.status(400).json({ error: { title: "Ticket ID is required" } });
        }

        // Map frontend display status back to Prisma Enum format
        const statusMap: Record<string, string> = {
            "Resolved": "RESOLVED",
            "In Progress": "IN_PROGRESS",
            "Open": "OPEN"
        };

        const updatedTicket = await (prisma.ticket as any).update({
            where: { id },
            data: { 
                ...(status && { status: statusMap[status] || status }),
                ...(priority && { priority }),
                ...(issue && { issue })
            },
        });

        res.json({ data: updatedTicket });
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ error: { title: "Failed to update ticket" } });
    }
};

/**
 * DELETE: Remove a ticket from the system.
 */
export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const id = req.body.id || req.query.id; 
        
        if (!id) {
            return res.status(400).json({ error: { title: "Ticket ID is required" } });
        }

        await (prisma.ticket as any).delete({
            where: { id: String(id) }
        });

        res.json({ success: true, message: "Ticket deleted successfully" });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ error: { title: "Failed to delete ticket" } });
    }
};