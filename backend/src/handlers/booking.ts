import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createBooking = async (req: Request, res: Response) => {
    try {
        console.log("--- New Booking Request ---");
        
        if (!req.body) {
            return res.status(400).json({ error: { title: "No data received" } });
        }

        const { guestName, buildingId, roomId } = req.body;

        if (!guestName || !buildingId || !roomId) {
            console.log("Failed: Missing fields in booking form");
            return res.status(400).json({ 
                error: { title: "Missing fields", description: "Name, building, and room are required." } 
            });
        }

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const bookingReference = `BKG-${randomNum}`;

        console.log(`Generating code: ${bookingReference} for ${guestName}`);

        const newBooking = await (prisma as any).booking.create({
            data: {
                id: bookingReference,
                buildingId: String(buildingId),
                roomId: String(roomId),
            }
        });

        console.log("Success! Booking saved.");
        
        res.status(201).json({ data: newBooking });
        
    } catch (error: any) {
        console.error("Booking generation error:", error.message);
        res.status(500).json({ error: { title: "Failed to create booking" } });
    }
};