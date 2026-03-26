// extract all these session.userId checks into an auth middleware, copying and pasting this is getting annoying
import type { NextFunction, Request, Response } from "express";
import { BuildingGroupId, buildingGroupId, CreateBuildingGroup, UserId } from "@autocoderz/shared";
import {
    createBuildingGroup as createBuildingGroupDB,
    deleteBuildingGroupFromId,
    getBuildingGroupsFromUserId,
    updateBuildingGroupFromId,
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
        // console.log("Creating new building group for user:", userId);
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

export async function deleteBuildingGroup(
    request: Request,
    response: Response,
    next: NextFunction,
) {
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
    const buildingGroupId = request.query.buildingGroupId as BuildingGroupId;

    if (!buildingGroupId) {
        response.status(400).json({
            error: {
                title: "BuildingGroupId not found",
                description: "No Building Group ID found in request query",
            },
        });
        return;
    }

    try {
        const success = await deleteBuildingGroupFromId(userId, buildingGroupId);

        if (!success) {
            response.status(500).json({
                error: {
                    title: "Could not delete",
                    description: "Database refused to delete it", // probably a foreign key issue again
                },
            });
            return;
        }
        response.status(200).json({ success });
        return;
    } catch (error) {
        next(error);
    }
}

export async function updateBuildingGroup(
    request: Request<{}, {}, CreateBuildingGroup>,
    response: Response,
    next: NextFunction,
) {
    const data = request.body;
    const userId = request.session.userId as UserId; // forcing type here because session types are still broken

    if (!userId) {
        response.status(401).json({
            error: {
                title: "Not authenticated",
                description: "You must be logged in to perform this action",
            },
        });
        return;
    }
    const buildingGroupId = request.query.buildingGroupId as BuildingGroupId;

    if (!buildingGroupId) {
        response.status(400).json({
            error: {
                title: "BuildingGroupId not found",
                description: "No Building Group ID found in request query",
            },
        });
        return;
    }
    try {
        const buildingGroup = await updateBuildingGroupFromId(userId, buildingGroupId, data);
        response.status(201).json({ success: true, data: buildingGroup }); // returning 201 for an update fix it later
        return;
    } catch (error) {
        next(error);
    }
}
