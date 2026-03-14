import * as express from "express";
import * as cors from "cors";
import * as session from "express-session";
import * as path from "path";
import * as signature from "cookie-signature";

import { Request, Response, NextFunction } from "express";

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma";

import { base } from "@autocoderz/shared";

import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import apsRouter from "./routes/aps";
import buildingGroupsRouter from "./routes/buildingGroups";
import buildingsRouter from "./routes/buildings";

const isProd = process.env.NODE_ENV === "production";

const PORT = parseInt(process.env.PORT ?? "3000");
const COOKIE_MAX_AGE_DAYS = parseInt(process.env.COOKIE_MAX_AGE_DAYS ?? "7");

const frontendPath = path.join(process.cwd(), "../frontend/dist-react");

const app = express();

app.set("trust proxy", 1);

app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

app.use(express.static(frontendPath));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;

    if (auth?.startsWith("Session ")) {
        const sid = auth.slice("Session ".length);

        const signed = "s:" + signature.sign(sid, process.env.SESSION_SECRET ?? "");

        const encoded = encodeURIComponent(signed);

        if (!req.headers.cookie) {
            req.headers.cookie = `sid=${encoded}`;
        } else if (!req.headers.cookie.includes("sid=")) {
            req.headers.cookie += `; sid=${encoded}`;
        }
    }

    next();
});

app.use(
    session({
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
        name: "sid",
        secret: process.env.SESSION_SECRET ?? "",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
            secure: isProd,
            httpOnly: true,
            sameSite: "lax",
        },
    }),
);

app.use(base, usersRouter);
app.use(base, authRouter);
app.use(base, apsRouter);
app.use(base, buildingGroupsRouter);
app.use(base, buildingsRouter);

app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    console.error(error);
    const maybeError = error as any;

    const status = maybeError?.status ?? maybeError?.statusCode ?? 500;

    const title = maybeError?.error?.title ?? "Internal Server Error";

    const description = maybeError?.error?.description ?? "Something went wrong.";
    response.status(status).json({ error: { title, description } });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith(base)) {
        next();
        return;
    }
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
