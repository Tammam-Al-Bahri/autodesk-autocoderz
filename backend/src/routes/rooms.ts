// I'm back to hardcoding the strings because I cba to add more constants to the shared package right now
import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { 
    createRoom, 
    getRooms, 
    checkOutRoom, 
    markRoomAsClean, 
    assignRoomTask,
    updateRoom,
    deleteRoom
} from "../handlers/rooms";

const router = Router();

router.get("/rooms", requireAuth, getRooms);
router.post("/rooms", requireAuth, createRoom);

// using POST for these because they feel more like actions rather than just updating data
router.post("/rooms/checkout", requireAuth, checkOutRoom);
router.post("/rooms/assign", requireAuth, assignRoomTask); // should this also create a ticket maybe for later
router.post("/rooms/clean", requireAuth, markRoomAsClean);

router.put("/rooms/:id", requireAuth, updateRoom); // finally using proper path params for once lol
router.delete("/rooms/:id", requireAuth, deleteRoom);


export default router;

// requireauth everywhere just to be safe but probably don't need it for get but whatever