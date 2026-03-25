import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

// 1. GET ALL TICKETS
export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { buildingGroupId, buildingId } = req.query;

        let where: any = {};
        if (buildingGroupId) {
            where.building = { buildingGroupId: String(buildingGroupId) };
        }
        if (buildingId) {
            where.buildingId = String(buildingId);
        }

        const tickets = await (prisma.ticket as any).findMany({
            where,
            include: { building: true, room: true },
            orderBy: { createdAt: "desc" }
        });

        const formattedTickets = tickets.map((t: any) => ({
            id: t.id,
            hotel: t.building?.name || "Managed Asset",
            room: t.room?.number || "N/A",
            issue: t.issue,
            status: t.status === "RESOLVED" ? "Resolved" : t.status === "IN_PROGRESS" ? "In Progress" : "Open",
            time: new Date(t.createdAt).toLocaleDateString("en-GB"),
            priority: t.priority.charAt(0) + t.priority.slice(1).toLowerCase(),
            buildingId: t.buildingId
        }));

        res.json({ data: formattedTickets });
    } catch (error) {
        next(error);
    }
};

// 2. CREATE TICKET (Fixed to use Session)
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { buildingId, roomId, issue, priority } = req.body;
        
        // ✅ FIX: Look at session.userId (populated by your login handler)
        const authorId = req.session.userId;

        if (!authorId) {
            return res.status(401).json({ error: { title: "Unauthorised", description: "Session invalid" } });
        }

        const newTicket = await (prisma.ticket as any).create({
            data: {
                buildingId,
                roomId: roomId || null,
                authorId,
                issue,
                priority: priority || "LOW", // Matches your TicketPriority Enum
                status: "OPEN",             // Matches your TicketStatus Enum
            }
        });

        res.status(201).json({ data: newTicket });
    } catch (error) {
        next(error);
    }
};

// 3. UPDATE TICKET
export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, status } = req.body;
        const dbStatus = status === "Resolved" ? "RESOLVED" : "OPEN";

        const updated = await (prisma.ticket as any).update({
            where: { id },
            data: { status: dbStatus }
        });
        res.json({ data: updated });
    } catch (error) {
        next(error);
    }
};