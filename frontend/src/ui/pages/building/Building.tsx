import AutodeskViewer from "@/components/AutodeskViewer";
import InviteBuidlingStaffForm from "@/components/building/InviteBuidlingStaffForm";
import BuildingStaffTable from "@/components/building/staff/BuildingStaffTable";
import { UploadBuildingModel } from "@/components/building/UploadBuildingModel";
import CopyId from "@/components/CopyId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";

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

    const [rooms, setRooms] = useState<any[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
    const [editRoomNumber, setEditRoomNumber] = useState("");
    const [editRoomType, setEditRoomType] = useState("SINGLE");

    const fetchRooms = async (showLoadingScreen = true) => {
        if (!buildingId) return;
        try {
            if (showLoadingScreen) setRoomsLoading(true);
            const res = await apiFetch(`${apiUrl}/rooms?buildingId=${buildingId}&_t=${Date.now()}`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setRooms(data.data);
        } catch (err) {
            console.error("Failed to load rooms");
        } finally {
            if (showLoadingScreen) setRoomsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms(true);
        
        const intervalId = setInterval(() => {
            if (!editingRoomId) {
                fetchRooms(false);
            }
        }, 5000);
        
        return () => clearInterval(intervalId);
    }, [buildingId, editingRoomId]);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setRoomError("");

        if (rooms.some((r) => r.number === newRoomNumber)) {
            setRoomError("A room with this number already exists.");
            return;
        }

        setSubmitLoading(true);

        try {
            const response = await apiFetch(`${apiUrl}/rooms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            toast.success(`Room ${newRoomNumber} added!`);
            fetchRooms(false);

        } catch (err: any) {
            setRoomError(err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        if (!window.confirm("Are you sure you want to delete this room permanently?")) return;
        
        try {
            const res = await apiFetch(`${apiUrl}/rooms/${roomId}`, { method: "DELETE", credentials: "include" });
            if (res.ok) {
                toast.success("Room deleted");
                fetchRooms(false);
            } else {
                toast.error("Cannot delete room. It might be in use by a guest.");
            }
        } catch (err) {
            toast.error("Network error");
        }
    };

    const startEditingRoom = (room: any) => {
        setEditingRoomId(room.id);
        setEditRoomNumber(room.number);
        setEditRoomType(room.type || "SINGLE");
    };

    const handleUpdateRoom = async (roomId: string) => {
        if (rooms.some((r) => r.number === editRoomNumber && r.id !== roomId)) {
            toast.error("A room with this number already exists.");
            return;
        }

        try {
            const res = await apiFetch(`${apiUrl}/rooms/${roomId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ number: editRoomNumber, type: editRoomType })
            });

            if (res.ok) {
                toast.success("Room updated");
                setEditingRoomId(null);
                fetchRooms(false);
            } else {
                toast.error("Update failed");
            }
        } catch (err) {
            toast.error("Network error");
        }
    };

    useEffect(() => {
        if (!buildingId) return;

        async function fetchStaff() {
            try {
                const res = await apiFetch(`${apiUrl}${buildingsBase}${buildingsRoutes.staff}?buildingId=${buildingId}`);
                const json = await res.json();
                if (res.ok) setStaff(json.data);
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
                const buildingRes = await apiFetch(`${apiUrl}${buildingsBase}?buildingId=${buildingId}`, { method: "GET", credentials: "include" });
                const buildingJson = await buildingRes.json();

                if (buildingRes.ok && buildingJson.data) {
                    const bData = Array.isArray(buildingJson.data)
                        ? buildingJson.data.find((b: any) => b.id === buildingId) || buildingJson.data[0]
                        : buildingJson.data;

                    if (bData) {
                        if (bData.urn) setBuildingUrn(bData.urn);
                        if (bData.name) setBuildingName(bData.name);
                        if (bData.buildingGroupId) setGroupId(bData.buildingGroupId);
                    }
                }

                const tokenRes = await apiFetch(`${apiUrl}${apsBase}${apsRoutes.viewerToken}`, { method: "GET", credentials: "include" });
                const tokenJson = await tokenRes.json();
                if (tokenRes.ok) setAutodeskToken(tokenJson.access_token);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [buildingId]);

    if (!buildingId) return <div>No building found</div>;

    return (
        <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
            <div className="flex flex-col gap-2 mb-6 border-b border-border pb-6">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Link to="/building-groups" className="hover:text-primary transition-colors">Portfolios</Link>
                    {groupId && (
                        <>
                            <ChevronRight className="w-4 h-4 mx-1" />
                            <Link to={`/building-groups/${groupId}`} className="hover:text-primary transition-colors">Group</Link>
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
                            Manage staff, rooms, models, and details for this building.
                        </p>
                    </div>
                </div>
            </div>

            <CopyId label="Building ID" value={buildingId} />

            <section className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Rooms Configuration</h2>
                        <p className="text-sm text-muted-foreground">Add and manage rooms so the receptionist can assign guests.</p>
                    </div>
                    <button 
                        onClick={() => setIsAddRoomModalOpen(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        + Add New Room
                    </button>
                </div>

                <div className="space-y-3 mt-4">
                    {roomsLoading && rooms.length === 0 ? (
                        <div className="text-center p-6 text-muted-foreground text-sm font-bold">Loading rooms...</div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center p-8 border-2 border-dashed rounded-xl text-slate-400 font-bold text-sm">
                            No rooms added yet. Click "+ Add New Room" to get started.
                        </div>
                    ) : (
                        rooms.map((room) => (
                            <Card key={room.id} className="border-2 shadow-sm">
                                <CardContent className="p-4 flex justify-between items-center">
                                    {editingRoomId === room.id ? (
                                        <div className="flex gap-4 w-full items-center">
                                            <Input 
                                                value={editRoomNumber} 
                                                onChange={(e) => setEditRoomNumber(e.target.value)} 
                                                placeholder="Room Number" 
                                                className="font-bold w-32"
                                            />
                                            <select 
                                                className="h-10 border-2 rounded-md px-3 font-bold bg-white"
                                                value={editRoomType}
                                                onChange={(e) => setEditRoomType(e.target.value)}
                                            >
                                                <option value="SINGLE">Single</option>
                                                <option value="DOUBLE">Double</option>
                                            </select>
                                            <div className="flex gap-2 ml-auto">
                                                <Button 
                                                    onClick={() => handleUpdateRoom(room.id)} 
                                                    disabled={editRoomNumber === room.number && editRoomType === (room.type || "SINGLE")}
                                                    className="bg-green-600 font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Save
                                                </Button>
                                                <Button onClick={() => setEditingRoomId(null)} variant="outline" className="font-bold">Cancel</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl font-black w-24">Room {room.number}</span>
                                                <Badge variant="outline" className="font-bold uppercase text-slate-500">
                                                    {room.type || "SINGLE"}
                                                </Badge>
                                                <Badge className={room.status === "Clean" ? "bg-green-500 hover:bg-green-600" : "bg-slate-500 hover:bg-slate-600"}>
                                                    {room.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={() => startEditingRoom(room)} variant="outline" size="sm" className="font-bold border-2">Edit</Button>
                                                <Button onClick={() => handleDeleteRoom(room.id)} size="sm" className="bg-rose-600 hover:bg-rose-700 font-bold">Delete</Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
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
                            <div className="h-[500px] bg-black rounded-lg overflow-hidden">
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
                                    className="w-full border border-input bg-background p-2 rounded-md font-bold"
                                    placeholder="e.g. 101"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">Room Type</label>
                                <select 
                                    value={newRoomType}
                                    onChange={(e) => setNewRoomType(e.target.value)}
                                    className="w-full border border-input bg-background p-2 rounded-md font-bold"
                                >
                                    <option value="SINGLE">Single</option>
                                    <option value="DOUBLE">Double</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddRoomModalOpen(false)}
                                    className="px-4 py-2 border border-input rounded-md hover:bg-muted text-sm font-bold"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitLoading}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-bold disabled:opacity-50"
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