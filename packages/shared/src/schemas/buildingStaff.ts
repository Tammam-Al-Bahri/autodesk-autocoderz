import { z } from "zod";
import { safeUserSchema, userId } from "./user.js";
import { buildingId, buildingSchema } from "./building.js";

const buildingStaffId = z.cuid().brand<"buildingStaffId">();
export type BuildingStaffId = z.infer<typeof buildingStaffId>;

const role = z.enum(["RECEPTIONIST", "MAINTENANCE"]);

const status = z.enum(["PENDING", "ACCEPTED", "DECLINED", "PAUSED"]);

export const createBuildingStaffInviteSchema = z.object({
    buildingId,
    userId,
    role,
});

export type CreateBuildingStaffInvite = z.infer<typeof createBuildingStaffInviteSchema>;

export const buildingStaffTableSchema = createBuildingStaffInviteSchema.extend({
    buildingStaffId,
    status,
    user: safeUserSchema,
    building: buildingSchema,
});

export type BuildingStaffTable = z.infer<typeof buildingStaffTableSchema>;
