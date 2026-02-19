import { NextFunction, Request, Response } from "express-serve-static-core";

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.session.userId) {
            response.status(401).json({ error: "Not authenticated" });
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
}
