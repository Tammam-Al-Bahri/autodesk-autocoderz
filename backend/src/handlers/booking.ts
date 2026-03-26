import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { guestName, roomId, buildingId } = req.body;

        if (!guestName || !roomId || !buildingId) {
            return res.status(400).json({ error: { title: "Missing required data" } });
        }
        // actually check if the room status is available before booking because right now you can book a room twice.


        // should probably wrap these two queries in a prisma transaction later so we don't end up with ghost bookings if the room update fails
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
        console.error("failed to create booking:", error.message); // keeping the message so that the frontend can display it
    res.status(500).json({ error: { title: "Booking failed", details: error.message } });
}
};