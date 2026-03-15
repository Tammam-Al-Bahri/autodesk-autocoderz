import AutodeskViewer from "@/components/AutodeskViewer";
import InviteStaffForm from "@/components/building/InviteBuidlingStaffForm";
import BuildingStaffTable from "@/components/building/staff/BuildingStaffTable";
import { UploadBuildingModel } from "@/components/building/UploadBuildingModel";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { apiFetch, apiUrl } from "@/lib/utils";
import { apsBase, apsRoutes, buildingsBase, type BuildingId } from "@autocoderz/shared";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Building() {
    const { buildingId } = useParams<{ buildingId: BuildingId }>();

    if (!buildingId) return <>no buildingId found</>;

    const [autodeskToken, setAutodeskToken] = useState("");
    const [buildingUrn, setBuildingUrn] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const method = "GET";

                const buildingRes = await apiFetch(
                    `${apiUrl}${buildingsBase}?buildingId=${buildingId}`,
                    {
                        method,
                        credentials: "include",
                    },
                );

                const buildingResData = await buildingRes.json();

                if (buildingRes.ok) {
                    const urn = buildingResData.data.urn;
                    if (!urn) return;
                    setBuildingUrn(urn);
                    console.log(urn);
                } else {
                    const { title, description } = buildingResData.error;
                    toast.error(title, { description });
                }

                const tokenRes = await apiFetch(`${apiUrl}${apsBase}${apsRoutes.viewerToken}`, {
                    method,
                    credentials: "include",
                });

                const tokenResData = await tokenRes.json();

                console.log(tokenResData.access_token);

                if (tokenRes.ok) {
                    setAutodeskToken(tokenResData.access_token);
                } else {
                    const { title, description } = tokenResData.error;
                    toast.error(title, { description });
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [buildingId]);

    return (
        <div className="flex-col">
            building id: {buildingId}
            <InviteStaffForm buildingId={buildingId} />
            <BuildingStaffTable buildingId={buildingId} />
            <UploadBuildingModel buildingId={buildingId} />
            {autodeskToken && buildingUrn && (
                <Card className="w-300">
                    <CardTitle>View model</CardTitle>
                    <CardContent>
                        <div className="relative h-150">
                            <AutodeskViewer urn={buildingUrn} token={autodeskToken} />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
