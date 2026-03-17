import type { NextFunction, Request, Response } from "express";
import { CreateUser, safeUserSchema, UserId } from "@autocoderz/shared";
import { createUser as createUserDB, searchUsers } from "../db/user";

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
