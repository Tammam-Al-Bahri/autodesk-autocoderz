import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createRoom = async (req: Request, res: Response) => {
    try {
        console.log("--- New Room Creation Request ---");
        const { number, type, buildingId } = req.body;

        const existingRoom = await (prisma as any).room.findFirst({
            where: {
                number: String(number),
                buildingId: String(buildingId)
            }
        });

        if (existingRoom) {
            console.log("Failed: Room number already exists in this building");
            return res.status(400).json({
                error: { 
                    title: "Room already exists", 
                    description: `Room ${number} is already registered in this building.` 
                }
            });
        }

        const newRoom = await (prisma as any).room.create({
            data: {
                number: String(number),
                type: String(type),
                status: "AVAILABLE",
                buildingId: String(buildingId)
            }
        });

        console.log(`Success! Room ${number} created.`);
        res.status(201).json({ data: newRoom });

    } catch (error: any) {
        console.error("Room creation error:", error.message);
        res.status(500).json({ error: { title: "Failed to create room" } });
    }
};

export const getRooms = async (req: Request, res: Response) => {
    try {
        const { buildingId } = req.query;
        
        if (!buildingId) {
            return res.status(400).json({ error: { title: "Building ID required" } });
        }

        const rooms = await (prisma as any).room.findMany({
            where: { buildingId: String(buildingId) },
            orderBy: { number: 'asc' }
        });

        const formattedRooms = rooms.map((room: any) => {
            let frontendStatus = "Clean";
            if (room.status === "OCCUPIED") frontendStatus = "Occupied";
            if (room.status === "DIRTY" || room.status === "MAINTENANCE") frontendStatus = "Dirty";

            return {
                id: room.id,
                number: room.number,
                status: frontendStatus,
                buildingId: room.buildingId,
            };
        });

        res.json({ data: formattedRooms });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: { title: "Could not retrieve rooms" } });
    }
};