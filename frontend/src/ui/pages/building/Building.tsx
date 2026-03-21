import AutodeskViewer from "@/components/AutodeskViewer";
import InviteStaffForm from "@/components/building/InviteBuidlingStaffForm";
import BuildingStaffTable from "@/components/building/staff/BuildingStaffTable";
import { UploadBuildingModel } from "@/components/building/UploadBuildingModel";
import CopyId from "@/components/CopyId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, apiUrl } from "@/lib/utils";
import {
    apsBase,
    apsRoutes,
    buildingsBase,
    buildingsRoutes,
    type BuildingId,
    type BuildingStaffTable as BuildingStaffTableType,
} from "@autocoderz/shared";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2, ChevronRight } from "lucide-react";

export default function Building() {
    const { buildingId } = useParams<{ buildingId: BuildingId }>();

    const [staff, setStaff] = useState<BuildingStaffTableType[]>([]);
    const [staffLoading, setStaffLoading] = useState(true);

    const [autodeskToken, setAutodeskToken] = useState("");
    const [buildingUrn, setBuildingUrn] = useState("");
    const [buildingName, setBuildingName] = useState("Loading Building...");
    const [groupId, setGroupId] = useState("");

    useEffect(() => {
        if (!buildingId) return;

        async function fetchStaff() {
            try {
                const res = await apiFetch(
                    `${apiUrl}${buildingsBase}${buildingsRoutes.staff}?buildingId=${buildingId}`,
                );

                const json = await res.json();

                if (res.ok) {
                    setStaff(json.data);
                }
            } finally {
                setStaffLoading(false);
            }
        }

        fetchStaff();
    }, [buildingId]);

    useEffect(() => {
        async function fetchData() {
            try {
                const buildingRes = await apiFetch(
                    `${apiUrl}${buildingsBase}?buildingId=${buildingId}`,
                    { method: "GET", credentials: "include" },
                );

                const buildingJson = await buildingRes.json();
                
                if (buildingRes.ok && buildingJson.data) {
                    const bData = Array.isArray(buildingJson.data) 
                        ? (buildingJson.data.find((b: any) => b.id === buildingId) || buildingJson.data[0])
                        : buildingJson.data;
                        
                    if (bData) {
                        if (bData.urn) setBuildingUrn(bData.urn);
                        if (bData.name) setBuildingName(bData.name);
                        if (bData.buildingGroupId) setGroupId(bData.buildingGroupId);
                    }
                }

                const tokenRes = await apiFetch(`${apiUrl}${apsBase}${apsRoutes.viewerToken}`, {
                    method: "GET",
                    credentials: "include",
                });

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
        return <div>No building found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
            
            <div className="flex flex-col gap-2 mb-6 border-b border-border pb-6">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Link to="/portfolios" className="hover:text-primary transition-colors">Portfolios</Link>
                    {groupId && (
                        <>
                            <ChevronRight className="w-4 h-4 mx-1" />
                            <Link to={`/portfolios/${groupId}`} className="hover:text-primary transition-colors">Group</Link>
                        </>
                    )}
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span className="text-foreground font-medium">{buildingName}</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground">{buildingName}</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage staff, models, and details for this building.</p>
                    </div>
                </div>
            </div>

            <CopyId label="Building ID" value={buildingId} />

            <section className="space-y-2">
                <h2 className="text-sm font-medium">Invite staff</h2>
                <InviteStaffForm buildingId={buildingId} setStaff={setStaff} />
            </section>

            <section className="space-y-2">
                <h2 className="text-sm font-medium">Staff</h2>
                <BuildingStaffTable data={staff} loading={staffLoading} />
            </section>

            <section className="space-y-2">
                <h2 className="text-sm font-medium">Upload model</h2>

                <Card className="p-4">
                    <CardHeader className="p-0 mb-3">
                        <CardTitle className="text-base">Upload building model</CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <UploadBuildingModel buildingId={buildingId} />
                    </CardContent>
                </Card>
            </section>

            {autodeskToken && buildingUrn && (
                <section className="space-y-2">
                    <h2 className="text-sm font-medium">3D viewer</h2>

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