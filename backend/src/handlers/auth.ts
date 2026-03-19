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

        request.session.save((error) => next(error));

        const safeUser = safeUserSchema.parse(user);
        response.status(200).json({ sid: request.session.id, safeUser });
        return;
    } catch (error) {
        next(error);
    }
}

export async function logout(request: Request, response: Response, next: NextFunction) {
    try {
        request.session.destroy((error) => {
            if (error) next(error);
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

export async function getUploadProgress(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.session.activeUploads) {
            request.session.activeUploads = {};
            response.json({ uploads: {} });
            return;
        }

        const now = Date.now();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 86,400,000 ms
        const FINISHED_GRACE_PERIOD_MS = 30 * 60 * 1000; // 30 minutes

        // Clean up finished or very old jobs
        for (const jobId in request.session.activeUploads) {
            const job = request.session.activeUploads[jobId];

            const isFinished = job.percent >= 100 && now - job.createdAt > FINISHED_GRACE_PERIOD_MS;
            const isStale = now - job.createdAt > ONE_DAY_MS;

            if (isFinished || isStale) {
                delete request.session.activeUploads[jobId];
            }
        }

        const { jobId } = request.query;

        if (!jobId) {
            // Return all remaining active uploads
            response.json({
                uploads: request.session.activeUploads || {},
            });
            return;
        }

        // Specific job requested
        const job = request.session.activeUploads?.[jobId as string];

        if (!job) {
            response.status(404).json({
                error: {
                    title: "Job not found or already finished",
                    description: "",
                },
            });
            return;
        }

        response.json({ job });
    } catch (error) {
        next(error);
    }
}
