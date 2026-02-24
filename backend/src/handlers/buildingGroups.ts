import type { Request, Response } from "express";
import { CreateBuildingGroup } from "@autocoderz/shared";
import { createBuildingGroup as createBuildingGroupDB } from "../db/buildingGroup";

export async function createBuildingGroup(
    request: Request<{}, {}, CreateBuildingGroup>,
    response: Response,
) {
    const data = request.body;
    const userId = request.session.userId;

    if (!userId) {
        response.status(401).json({ error: "Not authenticated" });
        return;
    }

    try {
        const buildingGroup = await createBuildingGroupDB(userId, data);
        response.status(201).json({ success: true, buildingGroup });
        return;
    } catch (error) {
        response.status(500).json(error);
        return;
    }
}
