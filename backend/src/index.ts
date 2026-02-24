import * as express from "express";
import * as cors from "cors";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import apsRouter from "./routes/aps";
import buildingGroupsRouter from "./routes/buildingGroups";
import * as session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma";
import {
    apsBase,
    authBase,
    authRoutes,
    buildingGroupsBase,
    usersBase,
    usersRoutes,
} from "@autocoderz/shared";

const PORT = parseInt(process.env.PORT ?? "3000");
const COOKIE_MAX_AGE_DAYS = parseInt(process.env.COOKIE_MAX_AGE_DAYS ?? "7");

const app = express();

app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

app.use(express.json());
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
            secure: false,
            httpOnly: true,
            sameSite: "lax",
        },
    }),
);

app.use(usersBase, usersRouter);
app.use(authBase, authRouter);
app.use(apsBase, apsRouter);
app.use(buildingGroupsBase, buildingGroupsRouter);

app.use(
    (
        error: unknown,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) => {
        console.error(error);

        const maybeError = error as any;

        const status = maybeError?.status ?? maybeError?.statusCode ?? 500;

        const title = maybeError?.error?.title ?? "Internal Server Error";

        const description = maybeError?.error?.description ?? "Something went wrong.";
        response.status(status).json({ error: { title, description } });
    },
);

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
