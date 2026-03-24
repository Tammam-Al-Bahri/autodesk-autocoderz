import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { 
    createRoom, 
    getRooms, 
    checkOutRoom, 
    markRoomAsClean, 
    assignRoomTask 
} from "../handlers/rooms";

const router = Router();

// Basic room management
router.get("/rooms", requireAuth, getRooms);
router.post("/rooms", requireAuth, createRoom);

// Room lifecycle and maintenance actions
router.post("/rooms/checkout", requireAuth, checkOutRoom);
router.post("/rooms/assign", requireAuth, assignRoomTask); 
router.post("/rooms/clean", requireAuth, markRoomAsClean);

export default router;