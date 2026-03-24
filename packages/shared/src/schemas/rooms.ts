import { z } from "zod";

export const createRoomSchema = z.object({
    number: z.string().min(1, "Room number is required"),
    type: z.enum(["SINGLE", "DOUBLE"]),
    buildingId: z.string().min(1, "Building ID is required"),
});