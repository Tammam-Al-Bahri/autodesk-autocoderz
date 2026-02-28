import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/utils";
import { buildingsBase, buildingsRoutes } from "@autocoderz/shared";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { SkeletonForm } from "../skeleton-form";

export function UploadBuildingModel({ buildingId }: { buildingId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleUpload() {
        setLoading(true);

        try {
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            const method = "POST";

            const response = await fetch(
                `${apiUrl}${buildingsBase}${buildingsRoutes.upload}?buildingId=${buildingId}`,
                {
                    method,
                    credentials: "include",
                    body: formData,
                },
            );

            const resData = await response.json();
            if (response.ok) {
                toast.success(`Model successfully uploaded`, {
                    description: JSON.stringify(resData, null, 2),
                });
            } else {
                const { title, description } = resData.error;
                toast.error(title, { description });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <Card className="p-6 w-full">
                <SkeletonForm />
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
            <Button onClick={handleUpload}>Upload Model</Button>
        </div>
    );
}
