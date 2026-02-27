import { UserId } from "@autocoderz/shared";
import "express-session";

declare module "express-session" {
    interface SessionData {
        userId?: UserId;
    }
}
