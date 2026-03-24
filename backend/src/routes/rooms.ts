import { Router } from "express";
import { validate } from "../lib/validate";
import { requireAuth } from "../middleware/auth";
import { createRoomSchema } from "@autocoderz/shared";
import { createRoom, getRooms } from "../handlers/rooms";

const router = Router();

// Get all rooms for a specific building
router.get(
    "/rooms", 
    requireAuth, 
    getRooms
);

// Create a new room 
router.post(
    "/rooms", 
    requireAuth, 
    validate(createRoomSchema), 
    createRoom
);

export default router;