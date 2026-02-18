import type { Request, Response } from "express";
import { CreateUser } from "../schemas/user";
import { createUser as createUserDB } from "../db/user";

export async function getUsers(request: Request, response: Response) {
    response.send("hello");
    return;
}

export async function createUser(request: Request<{}, {}, CreateUser>, response: Response) {
    const data = request.body;

    try {
        const user = await createUserDB(data);
        response.status(201).json(user);
        return;
    } catch (error) {
        response.status(500).json(error);
        return;
    }
}
