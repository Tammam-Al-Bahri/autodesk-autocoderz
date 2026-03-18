import type { NextFunction, Request, Response } from "express";
import {
    buildingGroupId as buildingGroupIdSchema,
    BuildingId,
    buildingId as buildingIdSchema,
    CreateBuilding,
    CreateBuildingStaffInvite,
    UserId,
} from "@autocoderz/shared";
import {
    canManageBuildingStaff,
    createBuilding as createBuildingDB,
    deleteBuildingFromId,
    getBuildingFromId,
    getBuildingsFromBuildingGroupId,
    updateBuildingFromId,
} from "../db/building";
import {
    createBuildingStaffInvite as createBuildingStaffInviteDB,
    getBuildingStaffFromBuildingId,
} from "../db/buildingStaff";
import { randomUUID } from "node:crypto";
import saveSession from "../lib/saveSession";
import { processApsUpload } from "../lib/processApsUpload";

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

export async function getBuildings(request: Request, response: Response, next: NextFunction) {
    try {
        const { buildingId } = request.query;
        const parsedBuildingId = buildingIdSchema.safeParse(buildingId);

        if (parsedBuildingId.success) {
            const building = await getBuildingFromId(parsedBuildingId.data);
            response.status(200).json({ success: true, data: building });
            return;
        }

        const { buildingGroupId } = request.query;
        const parsedBuildingGroupId = buildingGroupIdSchema.safeParse(buildingGroupId);

        if (!parsedBuildingGroupId.success) {
            response.status(400).json({
                error: {
                    title: "Invalid buildingGroupId",
                    description: parsedBuildingGroupId.error.issues[0].message,
                },
            });
            return;
        }

        const buildings = await getBuildingsFromBuildingGroupId(parsedBuildingGroupId.data);
        response.status(200).json({ success: true, data: buildings });
    } catch (error) {
        next(error);
    }
}

export async function uploadBuildingModel(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    try {
        const jobId = randomUUID();
        const createdAt = Date.now();

        request.session.activeUploads = {
            ...(request.session.activeUploads || {}),
            [jobId]: {
                status: "preparing",
                message: "",
                percent: 0,
                createdAt,
            },
        };

        await saveSession(request);

        const { buildingId } = request.query;
        const parsedId = buildingIdSchema.safeParse(buildingId);

        if (!parsedId.success) {
            return response.status(400).json({
                error: {
                    title: "Invalid buildingId",
                    description: parsedId.error.issues[0].message,
                },
            });
        }

        if (!request.file || request.file.size === 0) {
            return response.status(400).json({
                error: { title: "Invalid file upload", description: "" },
            });
        }

        // respond immediately
        response.status(200).json({ jobId });

        // then upload
        void processApsUpload({
            jobId,
            createdAt,
            file: request.file,
            buildingId: parsedId.data,
            session: request.session,
        }).catch((error) => {
            console.error("Upload error:", error);
        });
    } catch (error) {
        next(error);
    }
}

export async function createBuildingStaffInvite(
    request: Request<{}, {}, CreateBuildingStaffInvite>,
    response: Response,
    next: NextFunction,
) {
    const data = request.body;
    if (data.userId === request.session.userId) {
        response.status(400).json({ error: { title: "Can not invite yourself", description: "" } });
    }
    const userId = request.session.userId;

    if (userId) {
        const canInvite = await canManageBuildingStaff(userId, data.buildingId);
        if (!canInvite) {
            response.status(403).json({
                error: {
                    title: "Unauthorized",
                    description: "You do not have permission to invite staff to this building",
                },
            });
            return;
        }
    } else {
        response.status(401).json({
            error: {
                title: "Unauthenticated",
                description: "",
            },
        });
        return;
    }
    try {
        const building = await createBuildingStaffInviteDB(data);
        response.status(201).json({ success: true, data: building });
        return;
    } catch (error) {
        next(error);
    }
}

export async function getBuildingStaff(request: Request, response: Response, next: NextFunction) {
    try {
        const { buildingId } = request.query;
        const parsedId = buildingIdSchema.parse(buildingId);

        const buildingStaff = await getBuildingStaffFromBuildingId(parsedId);
        response.status(201).json({ success: true, data: buildingStaff });
        return;
    } catch (error) {
        next(error);
    }
}

export async function deleteBuilding(request: Request, response: Response, next: NextFunction) {
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
    const buildingId = request.query.buildingId as BuildingId;

    if (!buildingId) {
        response.status(400).json({
            error: {
                title: "BuildingId not found",
                description: "No Building ID found in request query",
            },
        });
        return;
    }

    try {
        const success = await deleteBuildingFromId(userId, buildingId);

        if (!success) {
            response.status(500).json({
                error: {
                    title: "Could not delete",
                    description: "",
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

export async function updateBuilding(
    request: Request<{}, {}, CreateBuilding>,
    response: Response,
    next: NextFunction,
) {
    const data = request.body;
    const userId = request.session.userId as UserId;

    if (!userId) {
        response.status(401).json({
            error: {
                title: "Not authenticated",
                description: "You must be logged in to perform this action",
            },
        });
        return;
    }
    const buildingId = request.query.buildingId as BuildingId;

    if (!buildingId) {
        response.status(400).json({
            error: {
                title: "BuildingId not found",
                description: "No Building ID found in request query",
            },
        });
        return;
    }
    try {
        const building = await updateBuildingFromId(userId, buildingId, data);
        response.status(201).json({ success: true, data: building });
        return;
    } catch (error) {
        next(error);
    }
}
