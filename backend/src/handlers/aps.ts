import { Request, Response, NextFunction } from "express";
import { getUploadToken } from "../lib/apsTokenService";

const BASIC_AUTH = process.env.APS_BASIC_AUTH;

if (!BASIC_AUTH) {
    throw new Error("APS_BASIC_AUTH is not defined");
}

export async function getApsViewerToken(request: Request, response: Response, next: NextFunction) {
    try {
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        params.append("scope", "viewables:read");

        const autodeskResponse = await fetch(
            "https://developer.api.autodesk.com/authentication/v2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${BASIC_AUTH}`,
                },
                body: params,
            },
        );

        if (!autodeskResponse.ok) {
            throw new Error(`Autodesk auth failed: ${autodeskResponse.status}`);
        }

        const data = await autodeskResponse.json();
        response.json(data);
    } catch (error) {
        next(error);
    }
}

export async function getUploadTokenHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const token = await getUploadToken();
        res.json({ access_token: token });
    } catch (err) {
        next(err);
    }
}
