import { UserId } from "@autocoderz/shared";
import "express-session";

declare type UploadJob = {
    status: string;
    message: string;
    percent: number;
    createdAt: number;
};

declare module "express-session" {
    interface SessionData {
        userId?: UserId;
        activeUploads: Record<string, UploadJob>;
    }
}
