import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getRooms = async (req: Request, res: Response) => {
    try {
        const buildingId = req.query.buildingId as string;
        if (!buildingId) {
            return res.status(400).json({ error: { title: "No building ID provided" } });
        }

        const roomsData = await (prisma as any).room.findMany({
            where: { buildingId },
            include: { 
                bookings: { orderBy: { id: 'desc' }, take: 1 } 
            },
            orderBy: { number: 'asc' }
        });

        const statusMap: Record<string, string> = {
            "AVAILABLE": "Clean",
            "OCCUPIED": "Occupied",
            "DIRTY": "Dirty",
            "MAINTENANCE": "Maintenance"
        };

        const results = roomsData.map((room: any) => {
            const latestGuest = room.bookings?.[0];
            
            return {
                id: room.id,
                number: room.number,
                status: statusMap[room.status] || "Clean",
                buildingId: room.buildingId,
                guest: latestGuest?.guestName || null,
                bookingId: latestGuest?.id || null, 
                assignedToId: room.assignedToId || null,
                assignedToName: room.assignedToName || null,
                assignedByName: room.assignedByName || null
            };
        });

        res.json({ data: results });
    } catch (err) {
        console.error("Error fetching rooms:", err);
        res.status(500).json({ error: { title: "Could not load rooms" } });
    }
};

export const assignRoomTask = async (req: Request, res: Response) => {
    try {
        const { roomId, staffId, staffName } = req.body;
        
        const currentUser = (req as any).user;
        const assignedBy = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : "Staff";

        await (prisma as any).room.update({
            where: { id: roomId },
            data: { 
                status: "MAINTENANCE",
                assignedToId: staffId,
                assignedToName: staffName,
                assignedByName: assignedBy
            }
        });
        res.json({ message: "Staff assigned successfully" });
    } catch (e) { 
        res.status(500).json({ error: { title: "Failed to assign staff" } }); 
    }
};

export const markRoomAsClean = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;
        await (prisma as any).room.update({
            where: { id: roomId },
            data: { 
                status: "AVAILABLE",
                assignedToId: null, 
                assignedToName: null, 
                assignedByName: null
            }
        });
        res.json({ message: "Room marked as clean" });
    } catch (err) { 
        res.status(500).json({ error: { title: "Update failed" } }); 
    }
};

export const checkOutRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;
        await (prisma as any).room.update({
            where: { id: roomId },
            data: { status: "DIRTY" } 
        });
        res.json({ message: "Guest checked out" });
    } catch (err) { 
        res.status(500).json({ error: { title: "Checkout error" } }); 
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { number, type, buildingId } = req.body;
        const room = await (prisma as any).room.create({
            data: { 
                number: String(number), 
                type: String(type), 
                status: "AVAILABLE", 
                buildingId: String(buildingId) 
            }
        });
        res.status(201).json({ data: room });
    } catch (error) { 
        res.status(500).json({ error: { title: "Room creation failed" } }); 
    }
};