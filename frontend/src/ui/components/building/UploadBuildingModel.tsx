import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch, apiUrl } from "@/lib/utils";
import { authBase, authRoutes, buildingsBase, buildingsRoutes } from "@autocoderz/shared";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

export function UploadBuildingModel({ buildingId }: { buildingId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    async function handleUpload() {
        if (!file) return;

        setLoading(true);
        setProgress(0);
        setStatus("uploading");
        setJobId(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await apiFetch(
                `${apiUrl}${buildingsBase}${buildingsRoutes.upload}?buildingId=${buildingId}`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            const resData = await response.json();

            if (response.ok) {
                if (!resData.jobId) {
                    toast.error("Upload failed - no jobId returned");
                    setLoading(false);
                    return;
                }

                setJobId(resData.jobId);
                setStatus("preparing");
                toast.info("Upload started - tracking progress...");
            } else {
                const { title, description } = resData.error ?? {};
                toast.error(title || "Upload failed", { description });
                setLoading(false);
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed - network error");
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!jobId || !loading) return;

        const interval = setInterval(async () => {
            try {
                const res = await apiFetch(
                    `${apiUrl}${authBase}${authRoutes.uploadProgress}?jobId=${jobId}`,
                );

                if (res.status === 404) {
                    clearInterval(interval);
                    setProgress(100);
                    setStatus("success");
                    setLoading(false);
                    toast.success("Model processing complete!");
                    return;
                }

                if (!res.ok) {
                    throw new Error("Progress fetch failed");
                }

                const data = await res.json();

                if (data.job) {
                    // Specific job response
                    const job = data.job;
                    setProgress(job.percent);
                    setStatus(job.status);
                    setMessage(job.message);

                    if (job.percent >= 100) {
                        clearInterval(interval);
                        setLoading(false);
                        toast.success("Model processing complete!", {
                            description: job.message,
                        });
                        setFile(null);
                    }
                } else if (data.uploads) {
                    setFile(null);
                    const job = data.uploads[jobId];
                    if (job) {
                        setProgress(job.percent);
                        setStatus(job.status);
                        setMessage(job.message);

                        if (job.percent >= 100 || job.status === "success") {
                            clearInterval(interval);
                            setLoading(false);
                            toast.success("Model processing complete!", {
                                description: job.message,
                            });
                            setFile(null);
                        }
                    } else {
                        // Job disappeared (cleaned up) → assume done or failed
                        clearInterval(interval);
                        setLoading(false);
                        setProgress(100);
                        setStatus("success");
                    }
                }
            } catch (err) {
                console.error("Progress polling error:", err);
                clearInterval(interval);
                setLoading(false);
                setStatus("error");
                toast.error("Could not track upload progress");
            }
        }, 500); // Poll every 0.5 s

        return () => clearInterval(interval);
    }, [jobId, loading]);

    if (loading) {
        return (
            <Card className="p-6 w-full">
                <div>{status}</div>
                <div>{message}</div>
                <div>{progress}%</div>
                {file && (
                    <div>
                        {file.name} • {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </div>
                )}
                <Progress value={progress} />
            </Card>
        );
    }

    return (
        <div>
            <Input
                type="file"
                accept=".rvt,.ifc,.dwg"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Button
                onClick={
                    file
                        ? handleUpload
                        : () => {
                              toast.error("No file selected");
                          }
                }
            >
                Upload Building Model
            </Button>
        </div>
    );
}
