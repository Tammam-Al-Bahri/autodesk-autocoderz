import * as express from "express";
import * as cors from "cors";
import usersRouter from "./routes/users";

const app = express();

app.use(
    cors({
        origin: true,
        credentials: false,
    }),
);

app.use("/api/users", usersRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
