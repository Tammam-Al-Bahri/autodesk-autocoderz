import type { NextFunction, Request, Response } from "express";
import { getBuildingsWhereStaffFromUserId } from "../db/buildingStaff";

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
        const buildings = await getBuildingsWhereStaffFromUserId(userId);
        response.status(201).json({ success: true, data: buildings });
        return;
    } catch (error) {
        next(error);
    }
}
