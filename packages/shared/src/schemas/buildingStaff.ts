import { z } from "zod";
import { safeUserSchema, userId } from "./user.js";
import { buildingId, buildingSchema } from "./building.js";

export const buildingStaffIdSchema = z.cuid().brand<"buildingStaffId">();
export type BuildingStaffId = z.infer<typeof buildingStaffIdSchema>;

const role = z.enum(["RECEPTIONIST", "MAINTENANCE"]);

const status = z.enum(["PENDING", "ACCEPTED", "DECLINED", "PAUSED"]);
export type BuildingStaffInviteStatus = z.infer<typeof status>;

export const createBuildingStaffInviteSchema = z.object({
    buildingId,
    userId,
    role,
});

export type CreateBuildingStaffInvite = z.infer<typeof createBuildingStaffInviteSchema>;

export const buildingStaffTableSchema = createBuildingStaffInviteSchema.extend({
    id: buildingStaffIdSchema,
    buildingStaffIdSchema,
    status,
    user: safeUserSchema,
    building: buildingSchema,
});

export type BuildingStaffTable = z.infer<typeof buildingStaffTableSchema>;

export const updateBuildingStaffStatusSchema = z.object({
    buildingStaffId: buildingStaffIdSchema,
    status: z.enum(status.options.filter((value) => value !== "PENDING")),
});

export type UpdateBuildingStaffStatus = z.infer<typeof updateBuildingStaffStatusSchema>;
