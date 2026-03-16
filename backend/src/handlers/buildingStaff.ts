import type { NextFunction, Request, Response } from "express";
import { getBuildingsWhereStaffFromUserId } from "../db/buildingStaff";
import { buildingId as buildingIdSchema } from "@autocoderz/shared";

export async function getStaffBuildings(request: Request, response: Response, next: NextFunction) {
    try {
        const userId = request.session.userId;
        if (!userId) {
            response.status(401).json({
                error: {
                    title: "Unauthenticated",
                    description: "",
                },
            });
            return;
        }
        const { buildingId } = request.query;
        const parsedBuildingId = buildingIdSchema.safeParse(buildingId);

        if (parsedBuildingId.success) {
            const building = await getBuildingsWhereStaffFromUserId(userId, parsedBuildingId.data);
            response.status(200).json({ success: true, data: building });
            return;
        }

        const buildings = await getBuildingsWhereStaffFromUserId(userId);
        response.status(201).json({ success: true, data: buildings });
        return;
    } catch (error) {
        next(error);
    }
}
