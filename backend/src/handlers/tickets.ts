import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { buildingGroupId, buildingId } = req.query;
        // console.log("Query params:", req.query); // left this here just in case the filtering breaks again

        let where: any = {};
        if (buildingGroupId) {
            where.building = { buildingGroupId: String(buildingGroupId) };
        }
        if (buildingId) {
            where.buildingId = String(buildingId);
        }

        // remove as any once prisma types are sorted out
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
            time: new Date(t.createdAt).toLocaleDateString("en-GB"), // formatting for UK time
            priority: t.priority.charAt(0) + t.priority.slice(1).toLowerCase(),
            buildingId: t.buildingId
        }));

        res.json({ data: formattedTickets });
    } catch (error) {
        next(error);
    }
};

// 2. CREATE TICKET
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { buildingId, roomId, issue, priority } = req.body;
        
        // grabbing userId from session instead of body to prevent spoofing
        const authorId = req.session.userId;

        if (!authorId) {
            return res.status(401).json({ error: { title: "Unauthorised", description: "Session invalid or expired" } });
        }

        const newTicket = await (prisma.ticket as any).create({
            data: {
                buildingId,
                roomId: roomId || null,
                authorId,
                issue,
                priority: priority || "LOW", // default fallback
                status: "OPEN",            
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
        // map the frontend string back to the DB enum
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