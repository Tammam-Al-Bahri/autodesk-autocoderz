import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiFetch, apiUrl } from "@/lib/utils";
import { toast } from "sonner";

type RoomStatus = "Clean" | "Dirty" | "Occupied" | "Maintenance";

interface Room {
  id: string;
  number: string;
  status: RoomStatus;
  guest?: string;
  bookingId?: string;
  buildingId: string;
  assignedToName?: string;
}

const statusColors: Record<RoomStatus, string> = {
  Clean: "bg-green-500",
  Dirty: "bg-red-500",
  Occupied: "bg-blue-600",
  Maintenance: "bg-amber-500",
};

export default function Receptionist() {
  const { buildingId } = useParams<{ buildingId: string }>();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [staffList, setStaffList] = useState<{ id: string; name: string }[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || null;

  useEffect(() => {
    if (!buildingId) return;

    const loadData = async (showLoadingScreen = true) => {
      try {
        if (showLoadingScreen) setLoading(true);
        
        const roomRes = await apiFetch(`${apiUrl}/rooms?buildingId=${buildingId}`, { credentials: "include" });
        const roomData = await roomRes.json();
        if (roomRes.ok) setRooms(roomData.data);

        const staffRes = await apiFetch(`${apiUrl}/users/buildings/${buildingId}/staff`, { credentials: "include" });
        const staffData = await staffRes.json();
        if (staffRes.ok) setStaffList(staffData.data);
      } catch (err) {
        console.error("Background sync failed");
      } finally {
        if (showLoadingScreen) setLoading(false);
      }
    };

    loadData(true);

    const intervalId = setInterval(() => {
      loadData(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [buildingId]);

  const handleCheckIn = async () => {
    if (!activeRoom || !guestName.trim()) return toast.error("Guest name is required");

    setLoading(true);
    const res = await apiFetch(`${apiUrl}/bookings`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName, roomId: activeRoom.id, buildingId: activeRoom.buildingId }),
    });

    const data = await res.json();
    if (res.ok) {
      setRooms((prev) => prev.map((r) => 
        r.id === activeRoom.id ? { ...r, status: "Occupied", guest: guestName, bookingId: data.data.id } : r
      ));
      setGuestName("");
      toast.success("Check-in complete!");
    } else {
      toast.error("Could not complete booking");
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    if (!activeRoom) return;
    setLoading(true);
    const res = await apiFetch(`${apiUrl}/rooms/checkout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: activeRoom.id }),
    });

    if (res.ok) {
      setRooms((prev) => prev.map((r) => 
        r.id === activeRoom.id ? { ...r, status: "Dirty", guest: undefined, bookingId: undefined } : r
      ));
      toast.success("Guest checked out");
    }
    setLoading(false);
  };

  const handleAssignTask = async (staffId: string) => {
    const staff = staffList.find(s => s.id === staffId);
    if (!activeRoom || !staff) return;

    setLoading(true);
    const res = await apiFetch(`${apiUrl}/rooms/assign`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: activeRoom.id, staffId: staff.id, staffName: staff.name }),
    });

    if (res.ok) {
      setRooms((prev) => prev.map((r) => 
        r.id === activeRoom.id ? { ...r, status: "Maintenance", assignedToName: staff.name } : r
      ));
      toast.success(`Assigned to ${staff.name}`);
    }
    setLoading(false);
  };

  if (!buildingId) return <div className="p-10 text-center">No building selected.</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 pb-20">
      <h1 className="text-3xl font-black mb-8 border-b pb-4">Receptionist Desk</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setActiveRoomId(room.id)}
              className={`h-28 rounded-xl flex flex-col items-center justify-center text-white cursor-pointer transition shadow-md ${statusColors[room.status]} ${room.id === activeRoomId ? "ring-4 ring-black scale-105" : ""}`}
            >
              <span className="text-2xl font-black">{room.number}</span>
              <span className="text-[10px] uppercase font-bold">{room.status}</span>
              {room.status === "Occupied" && <span className="mt-1 text-[10px] bg-black/20 px-2 rounded truncate max-w-[90%]">{room.guest}</span>}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {!activeRoom ? (
            <Card className="h-48 flex items-center justify-center text-slate-400 border-dashed border-2 font-bold">
              Select a room to view details
            </Card>
          ) : (
            <Card className="border-2 shadow-sm">
              <CardHeader className="border-b p-6">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black">Room {activeRoom.number}</span>
                  <Badge className={statusColors[activeRoom.status]}>{activeRoom.status}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {activeRoom.status === "Clean" && (
                  <div className="space-y-4">
                    <Input 
                      value={guestName} 
                      onChange={(e) => setGuestName(e.target.value)} 
                      placeholder="Guest Name..." 
                      className="h-12 border-2 font-bold"
                      disabled={loading}
                    />
                    <Button onClick={handleCheckIn} disabled={loading} className="w-full h-12 bg-blue-600 font-bold">
                      Check-In Guest
                    </Button>
                  </div>
                )}

                {activeRoom.status === "Occupied" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border-2 border-blue-100 rounded-xl">
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Guest</p>
                      <p className="text-lg font-bold">{activeRoom.guest}</p>
                      {activeRoom.bookingId && (
                        <div className="mt-2">
                          <p className="text-[10px] font-bold text-blue-400 uppercase">Code</p>
                          <p className="font-mono font-bold text-blue-600">{activeRoom.bookingId.slice(-6).toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                    <Button onClick={handleCheckOut} disabled={loading} className="w-full h-12 bg-rose-600 font-bold">
                      Check-Out
                    </Button>
                  </div>
                )}

                {activeRoom.status === "Dirty" && (
                  <div className="space-y-4">
                    <select 
                      className="w-full h-12 border-2 rounded-xl px-3 font-bold bg-white"
                      onChange={(e) => handleAssignTask(e.target.value)}
                      value=""
                      disabled={loading}
                    >
                      <option value="" disabled>Select Staff...</option>
                      {staffList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}

                {activeRoom.status === "Maintenance" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border-2 border-amber-100 rounded-xl text-center">
                      <p className="text-[10px] font-bold text-amber-500 uppercase">Worker Assigned</p>
                      <p className="text-lg font-black text-amber-700">{activeRoom.assignedToName}</p>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-500 mb-2">Reassign to someone else?</p>
                      <select 
                        className="w-full h-12 border-2 rounded-xl px-3 font-bold bg-white"
                        onChange={(e) => handleAssignTask(e.target.value)}
                        value=""
                        disabled={loading}
                      >
                        <option value="" disabled>Select New Staff...</option>
                        {staffList
                          .filter((s) => s.name !== activeRoom.assignedToName)
                          .map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}