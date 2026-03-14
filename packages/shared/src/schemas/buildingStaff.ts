import { z } from "zod";
import { userId } from "./user.js";
import { buildingId } from "./building.js";

const role = z.enum(["RECEPTIONIST", "MAINTENANCE"]);
const status = z.enum(["PENDING", "ACCEPTED", "DECLINED", "PAUSED"]);

export const createBuildingStaffInviteSchema = z.object({
    buildingId,
    userId,
    role,
});

export type CreateBuildingStaffInvite = z.infer<typeof createBuildingStaffInviteSchema>;
