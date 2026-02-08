import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getUsers(request: Request, response: Response) {
    const test = await prisma.test.create({
        data: {
            name: `TEST ${Math.random()}`,
        },
    });
    response.send(test);
    return;
}
