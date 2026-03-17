import AutodeskViewer from "@/components/AutodeskViewer";
import InviteStaffForm from "@/components/building/InviteBuidlingStaffForm";
import BuildingStaffTable from "@/components/building/staff/BuildingStaffTable";
import { UploadBuildingModel } from "@/components/building/UploadBuildingModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, apiUrl, cn } from "@/lib/utils";
import { apsBase, apsRoutes, buildingsBase, type BuildingId } from "@autocoderz/shared";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Building() {
    const { buildingId } = useParams<{ buildingId: BuildingId }>();

    const [autodeskToken, setAutodeskToken] = useState("");
    const [buildingUrn, setBuildingUrn] = useState("");
    const [showId, setShowId] = useState(false);

    useEffect(() => {
        if (showId) {
            const t = setTimeout(() => setShowId(false), 5000);
            return () => clearTimeout(t);
        }
    }, [showId]);

    useEffect(() => {
        async function fetchData() {
            try {
                const buildingRes = await apiFetch(
                    `${apiUrl}${buildingsBase}?buildingId=${buildingId}`,
                    { method: "GET", credentials: "include" }
                );

                const buildingJson = await buildingRes.json();
                if (buildingRes.ok && buildingJson.data?.urn) {
                    setBuildingUrn(buildingJson.data.urn);
                }

                const tokenRes = await apiFetch(
                    `${apiUrl}${apsBase}${apsRoutes.viewerToken}`,
                    { method: "GET", credentials: "include" }
                );

                const tokenJson = await tokenRes.json();
                if (tokenRes.ok) {
                    setAutodeskToken(tokenJson.access_token);
                }
            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, [buildingId]);

    if (!buildingId) {
        return <div style={{ padding: "20px" }}>No building found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto w-full p-6 space-y-6">

            <div>
                <div
                    onClick={() => setShowId(!showId)}
                    className="cursor-pointer text-sm mb-2"
                >
                    <strong>Building ID:</strong>{" "}
                    <span className={cn(showId ? "text-primary" : "text-muted-foreground")}>
                        {showId ? buildingId : "click to show"}
                    </span>
                </div>

                <h1 className="text-2xl font-semibold">
                    Building Management
                </h1>
            </div>

            <section className="space-y-2">
                <h2 className="text-sm font-medium">
                    Invite staff
                </h2>
                <InviteStaffForm buildingId={buildingId} />
            </section>

            <section className="space-y-2">
                <h2 className="text-sm font-medium">
                    Staff
                </h2>
                <BuildingStaffTable buildingId={buildingId} />
            </section>

            <section className="space-y-2">
                <h2 className="text-sm font-medium">
                    Upload model
                </h2>

                <Card className="p-4">
                    <CardHeader className="p-0 mb-3">
                        <CardTitle className="text-base">
                            Upload building model
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <UploadBuildingModel buildingId={buildingId} />
                    </CardContent>
                </Card>
            </section>

            {autodeskToken && buildingUrn && (
                <section className="space-y-2">
                    <h2 className="text-sm font-medium">
                        3D viewer
                    </h2>

                    <Card>
                        <CardContent className="p-0">
                            <div className="h-[500px] bg-black">
                                <AutodeskViewer urn={buildingUrn} token={autodeskToken} />
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}
        </div>
    );
}