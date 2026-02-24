import { NextFunction, Request, Response } from "express-serve-static-core";
import { userExists } from "../db/user";

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
    try {
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
        const exists = userExists(userId);
        if (!exists) {
            response.status(404).json({
                error: {
                    title: "User account not found",
                    description: "",
                },
            });
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
}
