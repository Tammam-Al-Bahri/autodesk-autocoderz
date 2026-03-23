import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// 1. GET ALL TICKETS (For the Manager Dashboard)
export const getTickets = async (req: Request, res: Response) => {
    try {
        const { buildingGroupId, buildingId } = req.query;

        let where: any = {};

        if (buildingGroupId) {
            where.building = {
                buildingGroupId: String(buildingGroupId)
            };
        }

        if (buildingId) {
            where.buildingId = String(buildingId);
        }

        const tickets = await (prisma.ticket as any).findMany({
            where,
            include: {
                building: true,
                room: true,
                author: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedTickets = tickets.map((t: any) => {
            let status = "Open";
            if (t.status === "RESOLVED") status = "Resolved";
            if (t.status === "IN_PROGRESS") status = "In Progress";

            let priority = "Low";
            if (t.priority) {
                priority = t.priority.charAt(0) + t.priority.slice(1).toLowerCase();
            }

            return {
                id: t.id,
                hotel: t.building?.name || "Unknown Property",
                room: t.room?.number || "N/A",
                issue: t.issue,
                status,
                time: new Date(t.createdAt).toLocaleDateString("en-GB"),
                priority,
            };
        });

        res.json({ data: formattedTickets });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ error: { title: "Could not retrieve tickets" } });
    }
};

// 2. CREATE TICKET (Staff/Manager version)
export const createTicket = async (req: Request, res: Response) => {
    try {
        const { buildingId, roomId, issue, priority } = req.body;
        const authorId = (req as any).user?.id;

        if (!authorId) {
            return res.status(401).json({ error: { title: "Unauthorized" } });
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

// 3. CREATE GUEST TICKET (Portal version)
export const createGuestTicket = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: { title: "No data received" } });
        }

        const { bookingId, issue } = req.body;

        if (!bookingId || !issue) {
            return res.status(400).json({ 
                error: { title: "Booking ID and issue are required" } 
            });
        }

        const booking = await (prisma as any).booking.findUnique({
            where: { id: bookingId },
            include: {
                building: true,
                room: true
            }
        });

        if (!booking) {
            return res.status(404).json({ 
                error: { title: "Invalid booking reference" } 
            });
        }

        const newTicket = await (prisma.ticket as any).create({
            data: {
                buildingId: booking.buildingId,
                roomId: booking.roomId,
                authorId: booking.userId || null,
                issue: `[GUEST REPORT] ${issue}`,
                priority: "MED",
                status: "OPEN",
            }
        });

        res.status(201).json({ data: newTicket });
    } catch (error) {
        console.error("Guest ticket error:", error);
        res.status(500).json({ error: { title: "Failed to submit request" } });
    }
};

// 4. UPDATE TICKET (Resolve/Progress)
export const updateTicket = async (req: Request, res: Response) => {
    try {
        const { id, status, priority, issue } = req.body;

        if (!id) {
            return res.status(400).json({ error: { title: "Ticket ID required" } });
        }

        let dbStatus = status;
        if (status === "Resolved") dbStatus = "RESOLVED";
        if (status === "In Progress") dbStatus = "IN_PROGRESS";
        if (status === "Open") dbStatus = "OPEN";

        const data: any = {};
        if (status) data.status = dbStatus;
        if (priority) data.priority = priority;
        if (issue) data.issue = issue;

        const updatedTicket = await (prisma.ticket as any).update({
            where: { id },
            data
        });

        res.json({ data: updatedTicket });
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ error: { title: "Failed to update ticket" } });
    }
};

// 5. DELETE TICKET
export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const id = req.body.id || req.query.id;

        if (!id) {
            return res.status(400).json({ error: { title: "Ticket ID required" } });
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