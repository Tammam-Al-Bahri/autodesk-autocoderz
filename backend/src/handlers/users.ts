import type { Request, Response } from "express";
import { CreateUser } from "@autocoderz/shared";
import { createUser as createUserDB } from "../db/user";

export async function getUsers(request: Request, response: Response) {
    response.send("hello");
    return;
}

export async function createUser(request: Request<{}, {}, CreateUser>, response: Response) {
    const data = request.body;

    try {
        const user = await createUserDB(data);
        request.session.userId = user.id;
        response.status(201).json({ success: true });
        return;
    } catch (error) {
        response.status(500).json(error);
        return;
    }
}
