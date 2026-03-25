import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { guestName, roomId, buildingId } = req.body;

        if (!guestName || !roomId || !buildingId) {
            return res.status(400).json({ error: { title: "Missing required data" } });
        }

        const booking = await (prisma as any).booking.create({
            data: {
                guestName,
                roomId,
                buildingId
            }
        });

        await (prisma as any).room.update({
            where: { id: roomId },
            data: { status: "OCCUPIED" }
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error: any) {
        console.error("BOOKING ERROR:", error.message);
        res.status(500).json({ error: { title: "Booking failed", details: error.message } });
    }
};