import { NextFunction, Request, Response } from "express-serve-static-core";
import { loginUser } from "../lib/loginUser";
import { loginUserSchema, safeUserSchema } from "@autocoderz/shared";
import { getUserById } from "../db/user";
import { prisma } from "../lib/prisma";

export async function login(request: Request, response: Response, next: NextFunction) {
    try {
        const result = loginUserSchema.safeParse(request.body);
        if (!result.success) {
            response.status(400).json({ error: "Invalid input" });
            return;
        }

        const { email, password } = result.data;

        const user = await loginUser(email, password);
        if (!user) {
            response.status(401).json({ error: "Invalid credentials" });
            return;
        }

        request.session.userId = user.id;

        const safeUser = safeUserSchema.parse(user);
        response.status(200).json({ token: request.session.id, safeUser });
        return;
    } catch (error) {
        next(error);
    }
}

export async function logout(request: Request, response: Response, next: NextFunction) {
    try {
        request.session.destroy((error) => {
            if (error) return next(error);
            response.clearCookie("sid");
            response.status(200).json({ message: "Logged out" });
        });
    } catch (error) {
        next(error);
    }
}

export async function me(request: Request, response: Response, next: NextFunction) {
    try {
        const userId = request.session.userId;
        console.log(userId);
        if (!userId) {
            response.status(401).json({ error: "Not logged in" });
            return;
        }

        const user = await getUserById(userId);
        if (!user) {
            response.status(404).json({ error: "User not found" });
            return;
        }
        const safeUser = safeUserSchema.safeParse(user);
        if (safeUser.success) {
            response.status(200).json({ user: safeUser.data });
            return;
        }
        response.status(500).json({ error: "User data error" });
        return;
    } catch (error) {
        next(error);
    }
}
