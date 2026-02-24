import type { NextFunction, Request, Response } from "express";
import { CreateBuildingGroup } from "@autocoderz/shared";
import { createBuildingGroup as createBuildingGroupDB } from "../db/buildingGroup";

export async function createBuildingGroup(
    request: Request<{}, {}, CreateBuildingGroup>,
    response: Response,
    next: NextFunction,
) {
    const data = request.body;
    const userId = request.session.userId;

    if (!userId) {
        response
            .status(401)
            .json({
                error: {
                    title: "Not authenticated",
                    description: "You must be logged in to perform this action",
                },
            });
        return;
    }

    try {
        const buildingGroup = await createBuildingGroupDB(userId, data);
        response.status(201).json({ success: true, buildingGroup });
        return;
    } catch (error) {
        next(error);
    }
}
