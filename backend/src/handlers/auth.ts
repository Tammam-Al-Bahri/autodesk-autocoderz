import { NextFunction, Request, Response } from "express-serve-static-core";
import { loginUser } from "../lib/loginUser";
import { loginUserSchema, safeUserSchema, UserId } from "@autocoderz/shared";
import { getUserById } from "../db/user";

export async function login(request: Request, response: Response, next: NextFunction) {
    try {
        const result = loginUserSchema.safeParse(request.body);
        if (!result.success) {
            response.status(400).json({ error: { title: "Invalid input", description: "" } });
            return;
        }

        const { email, password } = result.data;

        const user = await loginUser(email, password);
        if (!user) {
            response.status(401).json({ error: { title: "Invalid credentials", description: "" } });
            return;
        }

        request.session.userId = user.id as UserId;

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
        if (!userId) {
            response.status(401).json({ error: { title: "Not logged in", description: "" } });
            return;
        }

        const user = await getUserById(userId);
        if (!user) {
            response.status(404).json({ error: { title: "User not found", description: "" } });
            return;
        }
        const safeUser = safeUserSchema.safeParse(user);
        if (safeUser.success) {
            response.status(200).json({ user: safeUser.data });
            return;
        }
        response.status(500).json({ error: { title: "User data error", description: "" } });
        return;
    } catch (error) {
        next(error);
    }
}
