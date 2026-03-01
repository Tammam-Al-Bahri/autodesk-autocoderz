import { Request } from "express";

export default function saveSession(request: Request) {
    return new Promise<void>((resolve, reject) => {
        request.session.save((error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}
