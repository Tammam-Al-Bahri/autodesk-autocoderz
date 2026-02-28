import { z } from "zod";
import { userId } from "./user.js";

export const buildingGroupId = z.cuid().brand<"buildingGroupId">();
export type BuildingGroupId = z.infer<typeof buildingGroupId>;

export const createBuildingGroupSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Building group name must be at least 3 characters" })
        .max(50, { message: "Building group name must be at most 50 characters" }),
    description: z
        .string()
        .min(20, { message: "Building group description must be at least 20 characters" })
        .max(500, { message: "Building group description must be at most 500 characters" }),
});

export type CreateBuildingGroup = z.infer<typeof createBuildingGroupSchema>;

export const buildingGroupSchema = createBuildingGroupSchema.extend({
    id: buildingGroupId,
    ownerId: userId,
});

export type BuildingGroup = z.infer<typeof buildingGroupSchema>;
