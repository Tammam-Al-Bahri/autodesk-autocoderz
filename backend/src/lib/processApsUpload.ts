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

        const objectName = encodeURIComponent(file.originalname);
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

        if (numParts > 1) {
            queryParams.append("parts", numParts.toString());
        }

        const initiateUrl = `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectName}/signeds3upload?${queryParams}`;

        await update("uploading", "Requesting signed upload URLs", 8);

        const initiateRes = await fetch(initiateUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!initiateRes.ok) {
            throw new Error(`Initiate signed upload failed: ${initiateRes.status}`);
        }

        const signedData = (await initiateRes.json()) as {
            uploadKey: string;
            urls: string[];
        };

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
                throw new Error(`Part ${i + 1} would be too small (${chunkSize} bytes)`);
            }

            const chunk = file.buffer.subarray(chunkStart, chunkEnd);

            // Pre-upload feedback
            const basePercent = Math.round((i / actualParts) * 65) + 10;
            await update("uploading", `Uploading part ${i + 1}/${actualParts}`, basePercent);

            const uploadRes = await fetch(signedData.urls[i], {
                method: "PUT",
                headers: {
                    "Content-Type": file.mimetype || "application/octet-stream",
                },
                body: chunk,
            });

            if (!uploadRes.ok) {
                throw new Error(`S3 part ${i + 1} upload failed: ${uploadRes.status}`);
            }

            let eTag = uploadRes.headers.get("etag");
            if (!eTag) throw new Error(`Part ${i + 1} missing ETag`);

            eTag = eTag.replace(/^"|"$/g, "");
            partETags[i] = eTag;

            // Post-upload confirmation
            const afterPercent = Math.round(((i + 1) / actualParts) * 70) + 5;
            await update("uploading", `Uploaded part ${i + 1}/${actualParts}`, afterPercent);

            chunkStart = chunkEnd;
        }

        await update("uploaded", "Completing multipart upload", 75);

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
                    eTags: partETags,
                }),
            },
        );

        if (!completeRes.ok) {
            throw new Error(`Upload completion failed: ${completeRes.status}`);
        }

        await update("uploaded", "Upload completed - storing URN", 78);

        const rawUrn = `urn:adsk.objects:os.object:${bucketKey}/${objectName}`;
        const encodedUrn = Buffer.from(rawUrn).toString("base64url") as URN;

        void updateBuildingUrn(buildingId, encodedUrn);

        await update("translating", "URN stored - submitting translation job", 80);

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
            const errText = await translateRes.text();
            throw new Error(
                `Translation job submission failed: ${translateRes.status} - ${errText}`,
            );
        }

        await update("translating", "Translation job queued - waiting for Autodesk", 82);

        // Poll translation status
        let done = false;
        const manifestUrl = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodedUrn}/manifest`;

        while (!done) {
            await new Promise((r) => setTimeout(r, 3000));

            const manifestRes = await fetch(manifestUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!manifestRes.ok) {
                throw new Error(`Manifest check failed: ${manifestRes.status}`);
            }

            const manifest = (await manifestRes.json()) as any;

            if (manifest.status === "success") {
                done = true;
                await update("success", "Translation complete - model is ready", 100);
            } else if (manifest.status === "failed" || manifest.status === "timeout") {
                await update(
                    "error",
                    `Translation ${manifest.status} - ${manifest.progress || "check logs"}`,
                    100,
                );
                throw new Error(
                    `Translation ${manifest.status}: ${manifest.progress || "unknown reason"}`,
                );
            } else {
                let progress = 85;
                let message = "Processing model on Autodesk servers";

                if (manifest.progress && typeof manifest.progress === "string") {
                    const match = manifest.progress.match(/(\d+)%/);
                    if (match) {
                        const p = parseInt(match[1], 10);
                        progress = 80 + Math.floor(p * 0.18); // stretch to ~98%
                        message = `Autodesk translation progress: ${manifest.progress}`;
                    }
                }

                await update("translating", message, Math.min(progress, 98));
            }
        }

        await updateBuildingUrn(buildingId, encodedUrn); // ensure it's saved (idempotent)
    } catch (error) {
        await update("error", "Processing failed - please try again", 100);
        console.error("APS upload/translation error:", error);
        throw error;
    }
}
