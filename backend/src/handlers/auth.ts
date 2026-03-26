import { NextFunction, Request, Response } from "express-serve-static-core";
import { loginUser } from "../lib/loginUser";
import {
    ForgotPassword,
    loginUserSchema,
    ResetPassword,
    safeUserSchema,
    UserId,
} from "@autocoderz/shared";
import { getUserById } from "../db/user";
import { Resend } from "resend";
import { createPasswordReset, resetUserPassword } from "../db/passwordReset";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
}

const EMAIL_FROM = process.env.EMAIL_FROM;

if (!EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not defined");
}

console.log(`EMAIL_FROM: ${EMAIL_FROM}`);
console.log(`RESEND_API_KEY: ${RESEND_API_KEY}`);


// switch to using zod or t3-env for env validation instead of these ugly if statements
const resend = new Resend(RESEND_API_KEY);

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
            response.clearCookie("sid"); // hopefully this actually clears the cookie sometimes express session is weird with it
            response.status(200).json({ message: "Logged out" });
        });
    } catch (error) {
        next(error);
    }
}

export async function me(request: Request, response: Response, next: NextFunction) {
    try {
        const userId = request.session.userId;
        console.log("debug userId:", userId);
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
            // sweeping away the old jobs so the session object doesn't get massive (like the ninja meme)
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

export async function forgotPassword(
    request: Request<{}, {}, ForgotPassword>,
    response: Response,
    next: NextFunction,
) {
    try {
        const { email } = request.body;

        try {
            const { code } = await createPasswordReset({ email });

            const res = await resend.emails.send({
                from: EMAIL_FROM as string,
                to: email,
                subject: "Password Reset Code",
                html: `<p>Your code is <b>${code}</b></p>`,
            });
        } catch (error) {
           console.error("Failed to send Resend email:", error); // probably hit the free tier limit again
    response.status(500).json({ success: false });
}

        // always return success for security
        response.json({ success: true });
    } catch (error) {
        next(error);
    }
}

export async function resetPassword(
    request: Request<{}, {}, ResetPassword>,
    response: Response,
    next: NextFunction,
) {
    try {
        const test = await resetUserPassword(request.body);

        console.log("reset user password response", test);

        response.json({ success: true });
    } catch (error) {
        next(error);
    }
}
