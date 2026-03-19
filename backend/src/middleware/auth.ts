import { NextFunction, Request, Response } from "express-serve-static-core";

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
    try {
        const userId = request.session.userId;
        console.log(userId);
        if (!userId) {
            response.status(401).json({
                error: {
                    title: "Not authenticated",
                    description: "You must be logged in to perform this action",
                },
            });
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
}
