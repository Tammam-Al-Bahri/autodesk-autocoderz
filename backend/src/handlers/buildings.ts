import type { NextFunction, Request, Response } from "express";
import {
    buildingGroupId as buildingGroupIdSchema,
    buildingId as buildingIdSchema,
    CreateBuilding,
    URN,
} from "@autocoderz/shared";
import {
    createBuilding as createBuildingDB,
    getBuildingFromId,
    getBuildingsFromBuildingGroupId,
    updateBuildingUrn,
} from "../db/building";
import { getUploadToken } from "../lib/apsTokenService";

export async function createBuilding(
    request: Request<{}, {}, CreateBuilding>,
    response: Response,
    next: NextFunction,
) {
    const data = request.body;

    try {
        const building = await createBuildingDB(data);
        response.status(201).json({ success: true, data: building });
        return;
    } catch (error) {
        next(error);
    }
}

export async function getBuildings(request: Request, response: Response, next: NextFunction) {
    try {
        const { buildingId } = request.query;
        const parsedBuildingId = buildingIdSchema.safeParse(buildingId);

        if (parsedBuildingId.success) {
            const building = await getBuildingFromId(parsedBuildingId.data);
            response.status(200).json({ success: true, data: building });
            return;
        }

        const { buildingGroupId } = request.query;
        const parsedBuildingGroupId = buildingGroupIdSchema.safeParse(buildingGroupId);

        if (!parsedBuildingGroupId.success) {
            response.status(400).json({
                error: {
                    title: "Invalid buildingGroupId",
                    description: parsedBuildingGroupId.error.issues[0].message,
                },
            });
            return;
        }

        const buildings = await getBuildingsFromBuildingGroupId(parsedBuildingGroupId.data);
        response.status(200).json({ success: true, data: buildings });
    } catch (error) {
        next(error);
    }
}

export async function uploadBuildingModel(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    try {
        const { buildingId } = request.query;

        const parsedId = buildingIdSchema.safeParse(buildingId);
        if (!parsedId.success) {
            response.status(400).json({
                error: {
                    title: "Invalid buildingId",
                    description: parsedId.error.issues[0].message,
                },
            });
            return;
        }

        if (!request.file) {
            response.status(400).json({
                error: { title: "No file uploaded", description: "" },
            });
            return;
        }

        const file = request.file;
        if (file.size === 0) {
            response.status(400).json({ error: { title: "Empty file", description: "" } });
            return;
        }

        const token = await getUploadToken();
        const bucketKey = process.env.APS_BUCKET_KEY;
        if (!bucketKey) throw new Error("APS_BUCKET_KEY not defined");

        const objectName = encodeURIComponent(file.originalname);

        // Decide number of parts based on file size
        const MIN_PART_SIZE = 5 * 1024 * 1024; // 5 MB
        const TARGET_PART_SIZE = 100 * 1024 * 1024; // 100 MB - safe & efficient

        let numParts = 1;
        if (file.size > 100 * 1024 * 1024) {
            // only multipart for larger files
            numParts = Math.max(1, Math.ceil(file.size / TARGET_PART_SIZE));
            numParts = Math.min(numParts, 25); // APS max
        }

        // 1. Get pre-signed URLs
        const queryParams = new URLSearchParams({
            minutesExpiration: "60",
            useAcceleration: "false",
            singleUse: "true",
        });

        if (numParts > 1) {
            queryParams.append("parts", numParts.toString());
            // firstPart defaults to 1, no need to set unless resuming
        }

        const initiateUrl = `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectName}/signeds3upload?${queryParams}`;

        const initiateRes = await fetch(initiateUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!initiateRes.ok) {
            const errText = await initiateRes.text();
            throw new Error(`Failed to get signed S3 URLs: ${initiateRes.status} - ${errText}`);
        }

        const signedData = (await initiateRes.json()) as {
            uploadKey: string;
            uploadExpiration: string;
            urls: string[];
        };

        if (!signedData.urls?.length) {
            throw new Error("No upload URLs provided");
        }

        // APS may return fewer URLs than requested if file small → use actual count
        const actualParts = signedData.urls.length;
        const partETags: { partNumber: number; eTag: string }[] = [];

        // 2. Upload each part
        let chunkStart = 0;
        for (let i = 0; i < actualParts; i++) {
            const partNumber = i + 1;
            const isLast = i === actualParts - 1;

            let chunkEnd: number;
            if (isLast) {
                chunkEnd = file.size;
            } else {
                // Even split, but ensure non-last >= 5MB (should be true with our numParts logic)
                chunkEnd = chunkStart + Math.floor(file.size / actualParts);
            }

            const chunkSize = chunkEnd - chunkStart;
            if (!isLast && chunkSize < MIN_PART_SIZE) {
                throw new Error(
                    `Calculated non-last part ${partNumber} too small (${chunkSize} bytes). ` +
                        `File size: ${file.size}, parts requested: ${numParts}, actual: ${actualParts}`,
                );
            }

            const chunk = file.buffer.subarray(chunkStart, chunkEnd);
            chunkStart = chunkEnd;

            const uploadRes = await fetch(signedData.urls[i], {
                method: "PUT",
                headers: {
                    "Content-Type": file.mimetype || "application/octet-stream",
                },
                body: chunk,
            });

            if (!uploadRes.ok) {
                const errText = await uploadRes.text();
                throw new Error(
                    `S3 part ${partNumber} upload failed: ${uploadRes.status} - ${errText}`,
                );
            }

            let eTag = uploadRes.headers.get("etag");
            if (!eTag) {
                throw new Error(`No ETag for part ${partNumber}`);
            }
            eTag = eTag.replace(/^"|"$/g, ""); // normalize

            partETags.push({ partNumber, eTag });
        }

        // 3. Complete
        const completeRes = await fetch(
            `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectName}/signeds3upload`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uploadKey: signedData.uploadKey,
                    partETags,
                }),
            },
        );

        if (!completeRes.ok) {
            const errBody = await completeRes.json().catch(() => ({}));
            throw new Error(`Complete failed: ${completeRes.status} - ${JSON.stringify(errBody)}`);
        }

        const rawUrn = `urn:adsk.objects:os.object:${bucketKey}/${objectName}`;
        const encodedUrn = Buffer.from(rawUrn).toString("base64url") as URN;

        const translateRes = await fetch(
            "https://developer.api.autodesk.com/modelderivative/v2/designdata/job",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: { urn: encodedUrn },
                    output: {
                        destination: { region: "us" }, // or "eu" if your bucket is EMEA
                        formats: [
                            {
                                type: "svf2",
                                views: ["2d", "3d"],
                                advanced: { generateMasterViews: true },
                            },
                        ],
                    },
                }),
            },
        );

        if (!translateRes.ok) {
            const errBody = await translateRes.json().catch(() => ({}));
            console.warn("Translation job submission failed:", translateRes.status, errBody);
            // Still return success to frontend — viewer can poll later
        } else {
            console.log("Translation job submitted successfully");
        }

        const building = await updateBuildingUrn(parsedId.data, encodedUrn);

        response.status(200).json({ success: true, data: building });
        return;
    } catch (error) {
        next(error);
    }
}
