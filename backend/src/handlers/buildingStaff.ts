import type { NextFunction, Request, Response } from "express";
import { getBuildingsWhereStaffFromUserId, updateBuildingStaffStatus } from "../db/buildingStaff";
import {
    buildingId as buildingIdSchema,
    buildingStaffIdSchema,
    UpdateBuildingStaffStatus,
} from "@autocoderz/shared";

export async function getStaffBuildings(request: Request, response: Response, next: NextFunction) {
    try {
        const userId = request.session.userId;
        if (!userId) {
            response.status(401).json({
                error: {
                    title: "Unauthenticated",
                    description: "No active session", // frontend doesn't read this anyway so whatever
                },
            });
            return;
        }
        const { buildingId } = request.query;
        const parsedBuildingId = buildingIdSchema.safeParse(buildingId);
        
        // console.log("Did zod parse it?", parsedBuildingId.success);
        if (parsedBuildingId.success) {
            const building = await getBuildingsWhereStaffFromUserId(userId, parsedBuildingId.data);
            response.status(200).json({ success: true, data: building });
            return;
        }

        const buildings = await getBuildingsWhereStaffFromUserId(userId);
        response.status(201).json({ success: true, data: buildings }); // should this be 200 instead of 201? It works so I'm leaving it for now
        return;
    } catch (error) {
        next(error);
    }
}

// TODO: add authorisation checks later (to other handlers too once stuff figured out, shouldn't be hard)
export async function manageInvite(
    request: Request<{}, {}, UpdateBuildingStaffStatus>,
    response: Response,
    next: NextFunction,
) {
    try {
        const { buildingStaffId, status } = request.body;
        // console.log("Updating invite:", buildingStaffId, "to", status);

        // no checks for if user that is updating invite is the one who is invited - TODO
        await updateBuildingStaffStatus(buildingStaffId, status);

        return response.json({
            data: { success: true },
        });
    } catch (error) {
        next(error);
    }
}
