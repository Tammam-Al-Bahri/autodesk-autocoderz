import * as express from "express";
import * as cors from "cors";
import usersRouter from "./routes/users";
import { Response } from "express";

const app = express();

app.use(
    cors({
        origin: true,
        credentials: false,
    }),
);

app.use(express.json());

app.use("/api/users", usersRouter);

app.use((error: unknown, response: Response) => {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
