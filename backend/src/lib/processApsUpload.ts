import { Session, SessionData } from "express-session";
import { updateBuildingUrn } from "../db/building";
import { BuildingId, URN } from "@autocoderz/shared";
import { getUploadToken } from "./apsTokenService";

export async function processApsUpload(params: {
    jobId: string;
    createdAt: number;
    file: Express.Multer.File;
    buildingId: BuildingId;
    session: Session & Partial<SessionData>;
}) {
    const { jobId, createdAt, file, buildingId, session } = params;

    function save() {
        return new Promise<void>((resolve, reject) => {
            session.save((error: any) => (error ? reject(error) : resolve()));
        });
    }

    async function update(status: string, message: string, percent: number) {
        session.activeUploads = {
            ...session.activeUploads,
            [jobId]: {
                ...session.activeUploads?.[jobId],
                status,
                message,
                percent,
                createdAt,
            },
        };
        await save();
    }

    try {
        await update("uploading", "Preparing upload", 5);

        const token = await getUploadToken();
        const bucketKey = process.env.APS_BUCKET_KEY;
        if (!bucketKey) throw new Error("APS_BUCKET_KEY not defined");

        const objectKey = `building-${buildingId}-${encodeURIComponent(file.originalname)}`;
        const MIN_PART_SIZE = 5 * 1024 * 1024;

        let numParts = 1;
        if (file.size > 100 * 1024 * 1024) {
            numParts = Math.ceil(file.size / (100 * 1024 * 1024));
            numParts = Math.min(numParts, 25);
        }

        const queryParams = new URLSearchParams({
            minutesExpiration: "60",
            useAcceleration: "false",
            singleUse: "true",
        });

        if (numParts > 1) queryParams.append("parts", numParts.toString());

        const initiateUrl = `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectKey}/signeds3upload?${queryParams}`;

        await update("uploading", "Requesting signed URLs", 8);

        const initiateRes = await fetch(initiateUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!initiateRes.ok) throw new Error(`Initiate failed: ${initiateRes.status}`);

        const signedData = (await initiateRes.json()) as { uploadKey: string; urls: string[] };

        const actualParts = signedData.urls.length;
        const partETags: string[] = new Array(actualParts);

        const targetPartSize = Math.max(MIN_PART_SIZE, Math.ceil(file.size / actualParts));
        let chunkStart = 0;

        for (let i = 0; i < actualParts; i++) {
            const isLast = i === actualParts - 1;
            let chunkEnd = isLast ? file.size : chunkStart + targetPartSize;
            chunkEnd = Math.min(chunkEnd, file.size);

            const chunkSize = chunkEnd - chunkStart;
            if (!isLast && chunkSize < MIN_PART_SIZE) {
                throw new Error(`Part ${i + 1} too small`);
            }

            const chunk = file.buffer.subarray(chunkStart, chunkEnd);

            const basePercent = Math.round((i / actualParts) * 65) + 10;
            await update("uploading", `Uploading part ${i + 1}/${actualParts}`, basePercent);

            const uploadRes = await fetch(signedData.urls[i], {
                method: "PUT",
                headers: { "Content-Type": file.mimetype || "application/octet-stream" },
                body: chunk,
            });

            if (!uploadRes.ok) throw new Error(`Part ${i + 1} failed: ${uploadRes.status}`);

            let eTag = uploadRes.headers.get("etag");
            if (!eTag) throw new Error(`Part ${i + 1} missing ETag`);

            eTag = eTag.replace(/^"|"$/g, "");
            partETags[i] = eTag;

            const afterPercent = Math.round(((i + 1) / actualParts) * 70) + 5;
            await update("uploading", `Uploaded part ${i + 1}/${actualParts}`, afterPercent);

            chunkStart = chunkEnd;
        }

        await update("uploaded", "Completing upload", 75);

        const completeRes = await fetch(
            `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectKey}/signeds3upload`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uploadKey: signedData.uploadKey, eTags: partETags }),
            },
        );

        if (!completeRes.ok) throw new Error(`Completion failed: ${completeRes.status}`);

        await update("uploaded", "Storing model reference", 85);

        const rawUrn = `urn:adsk.objects:os.object:${bucketKey}/${objectKey}`;
        const encodedUrn = Buffer.from(rawUrn).toString("base64url") as URN;

        await updateBuildingUrn(buildingId, encodedUrn);

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
            console.warn(
                `Translation job submission failed (still marking success): ${translateRes.status}`,
            );
        }

        await update("success", "Model uploaded and ready to view (processing in background)", 100);
    } catch (error) {
        await update("error", "Upload failed - please try again", 0);
        console.error("APS upload error:", error);
        throw error;
    }
}
