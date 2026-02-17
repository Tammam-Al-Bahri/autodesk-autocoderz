import type { Request, Response } from "express";

export async function getUsers(request: Request, response: Response) {
    response.send("hello");
    return;
}

export async function createUser(request: Request<{}, {}>, response: Response) {
    console.log("test");
    response.send("test");
    return;
}
