import { z } from "zod";
import { buildingGroupId } from "./buildingGroup.js";
import { urn } from "./aps.js";

export const buildingId = z.cuid().brand<"buildingId">();
export type BuildingId = z.infer<typeof buildingId>;

export const buildingFormSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Building name must be at least 3 characters" })
        .max(50, { message: "Building name must be at most 50 characters" }),
    address: z.string(),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]),
    type: z.enum(["HOTEL", "MUSIC_STUDIO", "CREATIVE_SPACE", "CONFERENCE_CENTER", "OTHER"]),
});

export type BuildingForm = z.infer<typeof buildingFormSchema>;

export const createBuildingSchema = buildingFormSchema.extend({
    buildingGroupId,
});

export type CreateBuilding = z.infer<typeof createBuildingSchema>;

export const buildingSchema = createBuildingSchema.extend({
    id: buildingId,
    urn,
});

export type Building = z.infer<typeof buildingSchema>;
