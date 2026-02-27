import { z } from "zod";
import { buildingGroupId } from "./buildingGroup.js";

export const buildingId = z.cuid().brand<"BuildingId">();
export type BuildingId = z.infer<typeof buildingId>;

export const buildingFormSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Building name must be at least 3 characters" })
        .max(50, { message: "Building name must be at most 50 characters" }),
    address: z.string(),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]),
    type: z.enum(["HOTEL", "OTHER"]),
});

export type BuildingForm = z.infer<typeof buildingFormSchema>;

export const createBuildingSchema = buildingFormSchema.extend({
    buildingGroupId,
});

export type CreateBuilding = z.infer<typeof createBuildingSchema>;

export const buildingSchema = createBuildingSchema.extend({
    id: buildingId,
    urn: z.base64().optional(),
});

export type Building = z.infer<typeof buildingSchema>;
