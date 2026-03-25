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

router.post("/rooms/checkout", requireAuth, checkOutRoom);
router.post("/rooms/assign", requireAuth, assignRoomTask); 
router.post("/rooms/clean", requireAuth, markRoomAsClean);

router.put("/rooms/:id", requireAuth, updateRoom);
router.delete("/rooms/:id", requireAuth, deleteRoom);


export default router;