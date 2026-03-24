import type { NextFunction, Request, Response } from "express";
import { CreateUser, safeUserSchema, UserId } from "@autocoderz/shared";
import { createUser as createUserDB, searchUsers } from "../db/user";
import { prisma } from "../lib/prisma"; 

// 1. SEARCH USERS
export async function getUsers(request: Request, response: Response, next: NextFunction) {
    try {
        const query = request.query.q as string;

        if (!query || query.trim() === "") {
            response.json([]);
            return;
        }

        const users = await searchUsers(query);

        const safeUsersSchema = safeUserSchema.omit({ email: true }).array();
        const safeUsers = safeUsersSchema.parse(users);

        response.send(safeUsers);
        return;
    } catch (error) {
        next(error);
    }
}

// 2. GET STAFF BY BUILDING
// Fetches users who are linked to a specific building as maintenance staff
export async function getBuildingStaff(req: Request, res: Response, next: NextFunction) {
    try {
        const { buildingId } = req.params;

        if (!buildingId) {
            return res.status(400).json({ error: { title: "Building ID is required" } });
        }

        // We filter through the join table (BuildingStaff) to find active workers
        const staffMembers = await (prisma as any).user.findMany({
            where: {
                staff: {
                    some: {
                        buildingId: String(buildingId),
                        role: "MAINTENANCE",
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

        // Mapping the names into a single string for the frontend dropdown
        const list = staffMembers.map((u: any) => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`.trim()
        }));

        res.json({ data: list });
    } catch (err) { 
        next(err); 
    }
}

// 3. CREATE USER & SESSION
export async function createUser(
    request: Request<{}, {}, CreateUser>,
    response: Response,
    next: NextFunction,
) {
    const data = request.body;

    try {
        const user = await createUserDB(data);
        request.session.userId = user.id as UserId;
        response.status(201).json({ success: true });
        return;
    } catch (error) {
        next(error);
    }
}