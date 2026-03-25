import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getRooms = async (req: Request, res: Response) => {
    try {
        const buildingId = req.query.buildingId as string | undefined;
        const whereClause = buildingId ? { buildingId: String(buildingId) } : {};

        const roomsData = await (prisma as any).room.findMany({
            where: whereClause,
            include: { bookings: { orderBy: { id: 'desc' }, take: 1 } },
            orderBy: { number: 'asc' }
        });

        const statusMap: Record<string, string> = {
            "AVAILABLE": "Clean", "OCCUPIED": "Occupied", "DIRTY": "Dirty", "MAINTENANCE": "Maintenance"
        };

        const results = roomsData.map((room: any) => ({
            id: room.id,
            number: room.number,
            status: statusMap[room.status] || "Clean",
            buildingId: room.buildingId,
            guest: room.bookings?.[0]?.guestName || null,
            bookingId: room.bookings?.[0]?.id || null, 
            assignedToId: room.assignedToId || null,
            assignedToName: room.assignedToName || null,
            assignedByName: room.assignedByName || null
        }));

        res.json({ data: results });
    } catch (err) {
        res.status(500).json({ error: { title: "Could not load rooms" } });
    }
};

export const assignRoomTask = async (req: Request, res: Response) => {
    try {
        const { roomId, staffId, staffName } = req.body;
        const userId = (req as any).session?.userId;
        let assignedBy = "Receptionist";

        if (userId) {
            const user = await (prisma as any).user.findUnique({
                where: { id: String(userId) },
                select: { firstName: true, lastName: true }
            });
            if (user) assignedBy = `${user.firstName} ${user.lastName}`.trim();
        }

        await (prisma as any).room.update({
            where: { id: roomId },
            data: { 
                status: "MAINTENANCE",
                assignedToId: staffId,
                assignedToName: staffName,
                assignedByName: assignedBy,
                taskAssignedAt: new Date()
            }
        });
        res.json({ message: "Staff assigned" });
    } catch (e) { 
        res.status(500).json({ error: { title: "Failed to assign staff" } }); 
    }
};

export const markRoomAsClean = async (req: Request, res: Response) => {
    try {
        const { roomId, message } = req.body;
        const room = await (prisma as any).room.findUnique({ where: { id: roomId } });

        if (room && room.assignedToId) {
            await (prisma as any).taskLog.create({
                data: {
                    roomId: room.id,
                    roomNumber: room.number,
                    staffId: room.assignedToId,
                    staffName: room.assignedToName || "Staff",
                    assignedByName: room.assignedByName || "Receptionist",
                    message: message || null,
                    assignedAt: room.taskAssignedAt || new Date(),
                    completedAt: new Date()
                }
            });
        }

        await (prisma as any).room.update({
            where: { id: roomId },
            data: { 
                status: "AVAILABLE", assignedToId: null, 
                assignedToName: null, assignedByName: null, taskAssignedAt: null 
            }
        });

        res.json({ message: "Room marked as clean" });
    } catch (err) { 
        res.status(500).json({ error: { title: "Update failed" } }); 
    }
};

export const checkOutRoom = async (req: Request, res: Response) => {
    try {
        await (prisma as any).room.update({ where: { id: req.body.roomId }, data: { status: "DIRTY" } });
        res.json({ message: "Checked out" });
    } catch (err) { res.status(500).json({ error: { title: "Error" } }); }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const room = await (prisma as any).room.create({ data: { ...req.body, status: "AVAILABLE" } });
        res.status(201).json({ data: room });
    } catch (error) { res.status(500).json({ error: { title: "Failed" } }); }
};