import AutodeskViewer from "@/components/AutodeskViewer";
import InviteBuidlingStaffForm from "@/components/building/InviteBuidlingStaffForm";
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

    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [newRoomNumber, setNewRoomNumber] = useState("");
    const [newRoomType, setNewRoomType] = useState("SINGLE");
    const [roomError, setRoomError] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setRoomError("");
        setSubmitLoading(true);

        try {
            const response = await apiFetch(`${apiUrl}/rooms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    number: newRoomNumber,
                    type: newRoomType,
                    buildingId: buildingId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.description || "Failed to create room");
            }

            setIsAddRoomModalOpen(false);
            setNewRoomNumber("");
            setNewRoomType("SINGLE");
            
            alert(`Room ${newRoomNumber} successfully added to the building!`);

        } catch (err: any) {
            setRoomError(err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

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
        if (!buildingId) return;

        async function fetchData() {
            try {
                const buildingRes = await apiFetch(
                    `${apiUrl}${buildingsBase}?buildingId=${buildingId}`,
                    { method: "GET", credentials: "include" },
                );

                const buildingJson = await buildingRes.json();

                if (buildingRes.ok && buildingJson.data) {
                    const bData = Array.isArray(buildingJson.data)
                        ? buildingJson.data.find((b: any) => b.id === buildingId) ||
                          buildingJson.data[0]
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
                    <Link to="/building-groups" className="hover:text-primary transition-colors">
                        Portfolios
                    </Link>
                    {groupId && (
                        <>
                            <ChevronRight className="w-4 h-4 mx-1" />
                            <Link
                                to={`/building-groups/${groupId}`}
                                className="hover:text-primary transition-colors"
                            >
                                Group
                            </Link>
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
                        <h1 className="text-3xl md:text-4xl font-black text-foreground">
                            {buildingName}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage staff, models, and details for this building.
                        </p>
                    </div>
                </div>
            </div>

            <CopyId label="Building ID" value={buildingId} />

            <section className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Rooms Configuration</h2>
                        <p className="text-sm text-muted-foreground">Add rooms to this building so the receptionist can generate booking codes.</p>
                    </div>
                    <button 
                        onClick={() => setIsAddRoomModalOpen(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        + Add New Room
                    </button>
                </div>
            </section>

            <section className="space-y-2 pt-4 border-t border-border">
                <h2 className="text-sm font-medium">Invite staff</h2>
                <InviteBuidlingStaffForm buildingId={buildingId} setStaff={setStaff} />
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

            {isAddRoomModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full border border-border">
                        <h2 className="text-xl font-bold mb-4">Add New Room</h2>
                        
                        {roomError && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded mb-4 text-sm font-medium">
                                {roomError}
                            </div>
                        )}

                        <form onSubmit={handleCreateRoom}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Room Number</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newRoomNumber}
                                    onChange={(e) => setNewRoomNumber(e.target.value)}
                                    className="w-full border border-input bg-background p-2 rounded-md"
                                    placeholder="e.g. 101"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">Room Type</label>
                                <select 
                                    value={newRoomType}
                                    onChange={(e) => setNewRoomType(e.target.value)}
                                    className="w-full border border-input bg-background p-2 rounded-md"
                                >
                                    <option value="SINGLE">Single</option>
                                    <option value="DOUBLE">Double</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddRoomModalOpen(false)}
                                    className="px-4 py-2 border border-input rounded-md hover:bg-muted text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitLoading}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium disabled:opacity-50"
                                >
                                    {submitLoading ? "Saving..." : "Save Room"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}