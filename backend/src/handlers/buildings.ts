import type { NextFunction, Request, Response } from "express";
import { buildingGroupId as buildingGroupIdSchema, CreateBuilding } from "@autocoderz/shared";
import {
    createBuilding as createBuildingDB,
    getBuildingsFromBuildingGroupId,
} from "../db/building";

export async function createBuilding(
    request: Request<{}, {}, CreateBuilding>,
    response: Response,
    next: NextFunction,
) {
    const data = request.body;

    try {
        const building = await createBuildingDB(data);
        response.status(201).json({ success: true, data: building });
        return;
    } catch (error) {
        next(error);
    }
}

export async function getBuildings(
    request: Request<{}, {}, {}, { buildingGroupId: string }>,
    response: Response,
    next: NextFunction,
) {
    try {
        const { buildingGroupId } = request.query;
        const parsedId = buildingGroupIdSchema.safeParse(buildingGroupId);

        if (!parsedId.success) {
            return response.status(400).json({
                error: {
                    title: "Invalid buildingGroupId",
                    description: parsedId.error.issues[0].message,
                },
            });
        }

        const buildings = await getBuildingsFromBuildingGroupId(parsedId.data);
        response.status(200).json({ success: true, data: buildings });
    } catch (error) {
        next(error);
    }
}
