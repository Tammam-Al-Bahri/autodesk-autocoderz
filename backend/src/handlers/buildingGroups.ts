import type { NextFunction, Request, Response } from "express";
import { CreateBuildingGroup } from "@autocoderz/shared";
import {
    createBuildingGroup as createBuildingGroupDB,
    getBuildingGroupsFromUserId,
} from "../db/buildingGroup";

export async function createBuildingGroup(
    request: Request<{}, {}, CreateBuildingGroup>,
    response: Response,
    next: NextFunction,
) {
    const data = request.body;
    const userId = request.session.userId;

    if (!userId) {
        response.status(401).json({
            error: {
                title: "Not authenticated",
                description: "You must be logged in to perform this action",
            },
        });
        return;
    }

    try {
        const buildingGroup = await createBuildingGroupDB(userId, data);
        response.status(201).json({ success: true, data: buildingGroup });
        return;
    } catch (error) {
        next(error);
    }
}

export async function getBuildingGroups(request: Request, response: Response, next: NextFunction) {
    const userId = request.session.userId;

    if (!userId) {
        response.status(401).json({
            error: {
                title: "User not found",
                description: "No user ID found in session",
            },
        });
        return;
    }

    try {
        const buildingGroups = await getBuildingGroupsFromUserId(userId);
        response.status(200).json({ success: true, data: buildingGroups });
        return;
    } catch (error) {
        next(error);
    }
}
