import * as express from "express";
import * as cors from "cors";
import usersRouter from "./routes/users";
import * as session from "express-session";

const PORT = parseInt(process.env.PORT ?? "3000");
const COOKIE_MAX_AGE_DAYS = parseInt(process.env.COOKIE_MAX_AGE_DAYS ?? "7");

const app = express();

app.use(
    cors({
        origin: true,
        credentials: false,
    }),
);
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET ?? "",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
        },
    }),
);
app.use(
    (
        error: unknown,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) => {
        console.error(error);
        response.status(500).json({ error: "Internal server error" });
    },
);

app.use("/api/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
