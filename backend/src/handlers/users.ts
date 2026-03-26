import type { NextFunction, Request, Response } from "express";
import { CreateUser, safeUserSchema, UserId } from "@autocoderz/shared";
import { createUser as createUserDB, searchUsers } from "../db/user";
import { prisma } from "../lib/prisma"; 

export async function getUsers(request: Request, response: Response, next: NextFunction) {
    try {
        const query = request.query.q as string;

        if (!query || query.trim() === "") {
            response.json([]);
            return;
        }

        const users = await searchUsers(query);
        
        const safeUsersSchema = safeUserSchema.omit({ email: true }).array(); // stripping emails here so we don't leak them to the frontend search
        const safeUsers = safeUsersSchema.parse(users);

        response.send(safeUsers);
    } catch (error) {
        next(error);
    }
}

export async function getBuildingStaff(req: Request, res: Response, next: NextFunction) {
    try {
        // I need to stop switching between req, res and request, response in this file
        const { buildingId } = req.params;

        if (!buildingId) {
            return res.status(400).json({ error: { title: "Building ID is required" } });
        }

        const staffMembers = await (prisma as any).user.findMany({
            where: {
                staff: {
                    some: {
                        buildingId: String(buildingId),
                        role: "MAINTENANCE", // hardcoding this for now need to pass this in as a param later if we add receptionists
                        status: "ACCEPTED"
                    }
                }
            },
            select: { 
                id: true, 
                firstName: true, 
                lastName: true 
            }
        });

        const list = staffMembers.map((u: any) => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`.trim()
        }));

        res.json({ data: list });
    } catch (err) { 
        next(err); 
    }
}

export async function createUser(
    request: Request<{}, {}, CreateUser>,
    response: Response,
    next: NextFunction,
) {
    const data = request.body;

    try {
        const user = await createUserDB(data);
        request.session.userId = user.id as UserId; // auto login the user immediately after registering
        response.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export const acceptStaffInvite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { buildingId } = req.body;
        const userId = (req as any).session?.userId;

        if (!buildingId || !userId) {
            return res.status(400).json({ error: { title: "Missing building or user ID" } });
        }

        await (prisma as any).buildingStaff.updateMany({ // using updatemany instead of update just in case the staff accidentally got invited twice
            where: {
                userId: String(userId),
                buildingId: String(buildingId)
            },
            data: { status: "ACCEPTED" }
        });

        res.json({ success: true, message: "Invite accepted successfully!" });
    } catch (err) {
        next(err);
    }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).session?.userId;

        if (!userId) {
            return res.status(401).json({ error: { title: "Not authenticated" } });
        }

        const user = await (prisma as any).user.findUnique({
            where: { id: String(userId) },
            select: { id: true, firstName: true, lastName: true }
        });

        res.json({ data: user });
    } catch (err) {
        next(err);
    }
};

export const getMyTaskHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).session?.userId;

        if (!userId) {
            return res.status(401).json({ error: { title: "Not authenticated" } });
        }

        const logs = await (prisma as any).taskLog.findMany({
            where: { staffId: String(userId) },
            orderBy: { completedAt: 'desc' } // probably need to paginate this eventually before it crashes the app
        });

        res.json({ data: logs });
    } catch (err) {
        next(err);
    }
};