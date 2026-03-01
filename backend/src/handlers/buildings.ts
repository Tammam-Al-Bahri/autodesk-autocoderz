import type { NextFunction, Request, Response } from "express";
import {
    buildingGroupId as buildingGroupIdSchema,
    buildingId as buildingIdSchema,
    CreateBuilding,
    URN,
} from "@autocoderz/shared";
import {
    createBuilding as createBuildingDB,
    getBuildingFromId,
    getBuildingsFromBuildingGroupId,
    updateBuildingUrn,
} from "../db/building";
import { getUploadToken } from "../lib/apsTokenService";
import { randomUUID } from "node:crypto";
import { UploadJob } from "../types/express-session";
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

        // Respond immediately
        response.status(200).json({ jobId });

        // Fire-and-forget (no await)
        void processApsUpload({
            jobId,
            createdAt,
            file: request.file,
            buildingId: parsedId.data,
            session: request.session,
        });
    } catch (error) {
        next(error);
    }
}
