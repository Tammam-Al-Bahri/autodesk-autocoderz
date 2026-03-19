import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch, apiUrl } from "@/lib/utils";
import { authBase, authRoutes, buildingsBase, buildingsRoutes } from "@autocoderz/shared";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import {
    CloudUpload,
    FileBox,
    HardDriveUpload,
    CheckCircle2,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { Badge } from "../ui/badge";

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
        }, 500);

        return () => clearInterval(interval);
    }, [jobId, loading]);

    const getFileSize = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

    if (loading) {
        return (
            <Card className="p-6 w-full border-border bg-card shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-muted/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                {status === "error" ? (
                                    <AlertCircle className="w-5 h-5" />
                                ) : (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground flex items-center gap-2">
                                    Cloud Translation Active
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] uppercase bg-background text-foreground"
                                    >
                                        {status || "Initialising"}
                                    </Badge>
                                </h4>
                                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                    {message || "Synchronising BIM data with Autodesk Forge..."}
                                </p>
                            </div>
                        </div>
                        <span className="text-2xl font-black text-primary tracking-tighter">
                            {progress}%
                        </span>
                    </div>

                    <Progress value={progress} className="h-2" />

                    {file && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-border mt-1">
                            <span className="flex items-center font-mono truncate max-w-[200px]">
                                <FileBox className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                {file.name}
                            </span>
                            <span className="font-medium whitespace-nowrap">
                                {getFileSize(file.size)} MB
                            </span>
                        </div>
                    )}
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="relative group">
                <Input
                    type="file"
                    accept=".rvt,.ifc,.dwg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <div className="flex items-center justify-between p-3 border-2 border-dashed border-border rounded-lg bg-background group-hover:border-primary group-hover:bg-muted/50 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-muted rounded text-muted-foreground group-hover:text-primary transition-colors">
                            <HardDriveUpload className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-sm font-semibold text-foreground truncate">
                                {file ? file.name : "Select architectural file..."}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                {file ? `${getFileSize(file.size)} MB` : "RVT, IFC, DWG"}
                            </span>
                        </div>
                    </div>
                    {file && <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mx-2" />}
                </div>
            </div>

            <Button
                onClick={file ? handleUpload : () => toast.error("No file selected")}
                disabled={!file}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all shadow-md group"
            >
                <CloudUpload className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                Initialise Cloud Upload
            </Button>
        </div>
    );
}
