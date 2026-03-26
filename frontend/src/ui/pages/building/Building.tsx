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
} from "@autocoderz/shared";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function Building() {
  let { buildingId } = useParams<any>();

  const [staff, setStaff] = useState<any>([]);
  const [staffLoading, setStaffLoading] = useState(true);

  const [autodeskToken, setAutodeskToken] = useState("");
  const [buildingUrn, setBuildingUrn] = useState("");
  const [buildingName, setBuildingName] = useState("Loading Building...");
  const [groupId, setGroupId] = useState("");

  // modal state
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomType, setNewRoomType] = useState("SINGLE");
  const [roomError, setRoomError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // rooms state
  
  const [rooms, setRooms] = useState<any>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [editingRoomId, setEditingRoomId] = useState<any>(null);
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editRoomType, setEditRoomType] = useState("SINGLE");
  const [customRoomType, setCustomRoomType] = useState("");
  const [editCustomRoomType, setEditCustomRoomType] = useState("");

  const fetchRooms = async (showLoad = true) => {
    if (!buildingId) return;
    try {
      if (showLoad) setRoomsLoading(true);
      
      let res = await apiFetch(apiUrl + "/rooms?buildingId=" + buildingId + "&_t=" + Date.now(), { credentials: "include" });
      let data = await res.json();
      
      if (res.ok) {
        setRooms(data.data);
      }
    } catch (err) {
      console.log("Failed to load rooms", err);
    } finally {
      if (showLoad) setRoomsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(true);
  }, [buildingId, editingRoomId]);

  const handleCreateRoom = async (e: any) => {
    e.preventDefault();
    setRoomError("");

    // check if room exists
    let exists = rooms.some((r: any) => r.number === newRoomNumber);
    if (exists) {
      setRoomError("A room with this number already exists.");
      return;
    }

    setSubmitLoading(true);

    try {
      let response = await apiFetch(apiUrl + "/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: newRoomNumber,
          // If they selected OTHER send the custom text Otherwise send the dropdown choice.
          type: newRoomType === "OTHER" ? customRoomType : newRoomType,
          buildingId: buildingId
        }),
      });

      let data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.description || "Failed to create room");
      }

      setIsAddRoomModalOpen(false);
      setNewRoomNumber("");
      setNewRoomType("SINGLE");
      toast.success("Room " + newRoomNumber + " added!");
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
      let res = await apiFetch(apiUrl + "/rooms/" + roomId, { method: "DELETE", credentials: "include" });
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

  const startEditingRoom = (r: any) => {
    setEditingRoomId(r.id);
    setEditRoomNumber(r.number);
    // Check if it's one of the standard options
    const standardTypes = ["SINGLE", "DOUBLE", "STUDIO", "CONFERENCE"];
    
    if (standardTypes.includes(r.type)) {
      // It's a standard room
      setEditRoomType(r.type);
      setEditCustomRoomType("");
    } else {
      // It's a custom room so select OTHER in the dropdown and fill the text box
      setEditRoomType("OTHER");
      setEditCustomRoomType(r.type || "");
    }
  };

  const handleUpdateRoom = async (roomId: string) => {
    let dupes = rooms.some((r: any) => r.number === editRoomNumber && r.id !== roomId);
    if (dupes) {
      toast.error("A room with this number already exists.");
      return;
    }

    try {
      let res = await apiFetch(apiUrl + "/rooms/" + roomId, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: editRoomNumber, type: editRoomType === "OTHER" ? editCustomRoomType : editRoomType })
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

  const removeStaff = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;

    try {
      let res = await apiFetch(apiUrl + "/staff/" + id, { 
        method: "DELETE", 
        credentials: "include" 
      });

      if (res.ok) {
        toast.success("Staff member removed and synchronised!");
        setStaff((prev: any) => prev.filter((s: any) => s.id !== id));
      } else {
        toast.error("Could not remove staff. Check your permissions.");
      }
    } catch (err) {
      toast.error("Network error - is the server down?");
    }
  };

  // get staff
  useEffect(() => {
    if (!buildingId) return;

    async function getStaff() {
      try {
        let res = await apiFetch(apiUrl + buildingsBase + buildingsRoutes.staff + "?buildingId=" + buildingId);
        let json = await res.json();
        if (res.ok) setStaff(json.data);
      } finally {
        setStaffLoading(false);
      }
    }
    getStaff();
  }, [buildingId]);

  // get building details and viewer token
  useEffect(() => {
    if (!buildingId) return;

    async function fetchData() {
      try {
        let buildingRes = await apiFetch(apiUrl + buildingsBase + "?buildingId=" + buildingId, { method: "GET", credentials: "include" });
        let buildingJson = await buildingRes.json();

        if (buildingRes.ok && buildingJson.data) {
          let bData = Array.isArray(buildingJson.data)
            ? buildingJson.data.find((b: any) => b.id === buildingId) || buildingJson.data[0]
            : buildingJson.data;

          if (bData) {
            if (bData.urn) setBuildingUrn(bData.urn);
            if (bData.name) setBuildingName(bData.name);
            if (bData.buildingGroupId) setGroupId(bData.buildingGroupId);
          }
        }

        let tokenRes = await apiFetch(apiUrl + apsBase + apsRoutes.viewerToken, { method: "GET", credentials: "include" });
        let tokenJson = await tokenRes.json();
        if (tokenRes.ok) setAutodeskToken(tokenJson.access_token);
      } catch (err) {
        // console.log("err fetching building details", err);
      }
    }
    fetchData();
  }, [buildingId]);

  if (!buildingId) return <div>No building found</div>;

  return (
    <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col gap-2 mb-6 border-b border-border/60 dark:border-border/40 pb-6">
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
          <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
            <Building2 className="w-8 h-8 text-primary dark:text-primary/90" />
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

      {/* Rooms Section */}
      <section className="space-y-4 pt-4 border-t border-border/60 dark:border-border/40">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Rooms Configuration</h2>
            <p className="text-sm text-muted-foreground">Add and manage rooms so the receptionist can assign guests.</p>
          </div>
          <button 
            onClick={() => setIsAddRoomModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            + Add New Room
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {roomsLoading && rooms.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground text-sm font-bold">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed border-border/50 dark:border-border/30 bg-muted/20 dark:bg-muted/5 rounded-xl text-muted-foreground font-bold text-sm">
              No rooms added yet. Click "++ Add New Room" to get started.
            </div>
          ) : (
            rooms.map((room: any) => (
              <Card key={room.id} className="border border-border/50 dark:border-border/40 shadow-sm bg-card dark:bg-zinc-900/80">
                <CardContent className="p-4 flex justify-between items-center">
                  
                  {editingRoomId === room.id ? (
                    <div className="flex gap-4 w-full items-center">
                      <Input 
                        value={editRoomNumber} 
                        onChange={(e) => setEditRoomNumber(e.target.value)} 
                        placeholder="Room Number" 
                        className="font-bold w-32 bg-background dark:bg-zinc-950 border-input dark:border-border/40 text-foreground"
                      />
                      <div className="flex flex-col gap-1">
                        <select 
                          className="h-10 border border-input dark:border-border/40 rounded-md px-3 font-bold bg-background dark:bg-zinc-950 text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                          value={editRoomType}
                          onChange={(e) => setEditRoomType(e.target.value)}
                        >
                          <option value="SINGLE">Single</option>
                          <option value="DOUBLE">Double</option>
                          <option value="STUDIO">Studio</option>
                          <option value="CONFERENCE">Conference Room</option>
                          <option value="OTHER">Other...</option>
                        </select>
                        
                        {editRoomType === "OTHER" && (
                          <input 
                            type="text" 
                            required
                            value={editCustomRoomType}
                            onChange={(e) => setEditCustomRoomType(e.target.value)}
                            className="h-8 text-sm border border-input dark:border-border/40 bg-background dark:bg-zinc-950 text-foreground px-2 rounded-md font-bold outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Custom type..."

                          />
                        )}
                      </div>
                      <div className="flex gap-2 ml-auto">
                        <Button 
                          onClick={() => handleUpdateRoom(room.id)} 
                          disabled={editRoomNumber === room.number && editRoomType === (room.type || "SINGLE")}
                          className="bg-green-600 dark:bg-green-600 font-bold hover:bg-green-700 dark:hover:bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          Save
                        </Button>
                        <Button onClick={() => setEditingRoomId(null)} variant="outline" className="font-bold border-border/50 dark:border-border/40 hover:bg-muted dark:hover:bg-zinc-800 text-foreground">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-black w-24 text-foreground">Room {room.number}</span>
                        <Badge variant="outline" className="font-bold uppercase text-muted-foreground border-border/50 dark:border-border/40 bg-muted/30 dark:bg-zinc-800/50">
                          {room.type || "SINGLE"}
                        </Badge>
                        <Badge className={room.status === "Clean" ? "bg-green-500 dark:bg-green-500/20 text-white dark:text-green-400 hover:bg-green-600" : "bg-slate-500 dark:bg-slate-500/20 text-white dark:text-slate-300 hover:bg-slate-600"}>
                          {room.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => startEditingRoom(room)} variant="outline" size="sm" className="font-bold border border-border/50 dark:border-border/40 bg-background dark:bg-zinc-950 hover:bg-muted dark:hover:bg-zinc-800 text-foreground">Edit</Button>
                        <Button onClick={() => handleDeleteRoom(room.id)} size="sm" className="bg-rose-600 dark:bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-500 text-white font-bold shadow-sm">Delete</Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Staff Section */}
      <section className="space-y-2 pt-4 border-t border-border/60 dark:border-border/40">
        <h2 className="text-sm font-medium text-foreground">Invite staff</h2>
        {/* We cast buildingId here to keep TypeScript happy with the branded type */}
        <InviteBuidlingStaffForm buildingId={buildingId as BuildingId} setStaff={setStaff} />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Staff</h2>
        <BuildingStaffTable data={staff} loading={staffLoading} onRemove={removeStaff} />
      </section>

      {/* Model Section */}
      <section className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Upload model</h2>
        <Card className="p-4 bg-card dark:bg-zinc-900/80 border-border/50 dark:border-border/40 shadow-sm">
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-base text-foreground">Upload building model</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* We cast buildingId here as well to satisfy TypeScript */}
            <UploadBuildingModel buildingId={buildingId as BuildingId} />
          </CardContent>
        </Card>
      </section>

      {autodeskToken && buildingUrn && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-foreground">3D viewer</h2>
          <Card className="border-border/50 dark:border-border/40 shadow-sm overflow-hidden bg-card dark:bg-zinc-950">
            <CardContent className="p-0">
              <div className="h-[500px] bg-black">
                <AutodeskViewer urn={buildingUrn} token={autodeskToken} />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Add Room Modal */}
      {isAddRoomModalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-background dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-md w-full border border-border/50 dark:border-border/20">
            <h2 className="text-xl font-bold mb-4 text-foreground">Add New Room</h2>
            
            {roomError && (
              <div className="bg-destructive/10 dark:bg-rose-900/20 text-destructive dark:text-rose-400 p-3 rounded-md mb-4 text-sm font-medium border border-destructive/20 dark:border-rose-900/30">
                {roomError}
              </div>
            )}

            <form onSubmit={handleCreateRoom}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-foreground">Room Number</label>
                <input 
                  type="text" 
                  required
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full border border-input dark:border-border/40 bg-background dark:bg-zinc-950 text-foreground p-2 rounded-md font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. 101"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-foreground">Room Type</label>
                <select 
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="w-full border border-input dark:border-border/40 bg-background dark:bg-zinc-950 text-foreground p-2 rounded-md font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="SINGLE">Single</option>
                  <option value="DOUBLE">Double</option>
                  <option value="STUDIO">Studio</option>
                  <option value="CONFERENCE">Conference Room</option>
                  <option value="OTHER">Other (Custom)...</option>
                </select>
                
                {newRoomType === "OTHER" && (
                  <input 
                    type="text" 
                    required
                    value={customRoomType}
                    onChange={(e) => setCustomRoomType(e.target.value)}
                    className="w-full mt-2 border border-input dark:border-border/40 bg-background dark:bg-zinc-950 text-foreground p-2 rounded-md font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Enter custom room type..."
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border/50 dark:border-border/20">
                <button 
                  type="button"
                  onClick={() => setIsAddRoomModalOpen(false)}
                  className="px-4 py-2 border border-input dark:border-border/40 bg-background dark:bg-zinc-800 rounded-md hover:bg-muted dark:hover:bg-zinc-700 text-foreground text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 bg-primary dark:bg-primary/90 text-primary-foreground rounded-md hover:bg-primary/90 dark:hover:bg-primary text-sm font-bold disabled:opacity-50 transition-colors shadow-sm"
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