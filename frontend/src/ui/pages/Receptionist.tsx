import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiFetch, apiUrl } from "@/lib/utils";
import { toast } from "sonner";

type RoomStatus = "Clean" | "Dirty" | "Occupied";

interface Room {
  id: string;
  number: string;
  status: RoomStatus;
  guest?: string;
  buildingId: string;
}

const statusColors: Record<RoomStatus, string> = {
  Clean: "bg-green-500",
  Dirty: "bg-red-500",
  Occupied: "bg-blue-500",
};

export default function Receptionist() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [maintenanceNote, setMaintenanceNote] = useState("");
  const [loading, setLoading] = useState(false);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || null;

  useEffect(() => {
    const currentBuildingId = "cmn0kx9fq0006fgecxme3au4p";

    const dummyRooms: Room[] = [
      { id: "test-room-1", number: "101", status: "Clean", buildingId: currentBuildingId },
      { id: "test-room-2", number: "102", status: "Occupied", guest: "Mr Thompson", buildingId: currentBuildingId },
      { id: "test-room-3", number: "103", status: "Dirty", buildingId: currentBuildingId },
      { id: "test-room-4", number: "104", status: "Clean", buildingId: currentBuildingId },
      { id: "test-room-5", number: "105", status: "Clean", buildingId: currentBuildingId },
      { id: "test-room-6", number: "106", status: "Dirty", buildingId: currentBuildingId },
      { id: "test-room-7", number: "107", status: "Occupied", guest: "A. Patel", buildingId: currentBuildingId },
      { id: "test-room-8", number: "108", status: "Clean", buildingId: currentBuildingId },
    ];

    setRooms(dummyRooms);
  }, []);

  const checkInGuest = async () => {
    if (!activeRoom || !guestName.trim()) return;

    setLoading(true);

    try {
        const response = await apiFetch(`${apiUrl}/bookings`, {
            method: "POST",
            body: JSON.stringify({
                guestName: guestName,
                buildingId: activeRoom.buildingId,
                roomId: activeRoom.id
            }),
        });

        const json = await response.json();

        if (response.ok) {
            const newBookingCode = json.data.id;
            
            setRooms((prev) =>
              prev.map((room) =>
                room.id === activeRoom.id
                  ? { ...room, status: "Occupied", guest: guestName }
                  : room
              )
            );

            setGuestName("");
            toast.success("Check-in Complete", {
                description: `Give the guest this code: ${newBookingCode}`
            });
            
            alert(`CHECK-IN SUCCESS\n\nPlease provide the guest with their portal access code:\n\n${newBookingCode}`);
            
        } else {
            toast.error("Check-in Failed", { description: json.error?.title });
        }
    } catch (error) {
        toast.error("Network Error", { description: "Could not reach the server." });
    }
    
    setLoading(false);
  };

  const logMaintenance = () => {
    if (!activeRoom || !maintenanceNote.trim()) return;
    console.log(`Maintenance request for ${activeRoom.number}: ${maintenanceNote}`);
    setMaintenanceNote("");
    toast.success("Maintenance team notified.");
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 mb-20">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-black tracking-tight">
          Front Desk – Room Status
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Click a room to manage check-ins or report maintenance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-slate-50 border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-slate-500">
                Floor Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {rooms.map((room) => {
                  const isActive = room.id === activeRoomId;

                  return (
                    <div
                      key={room.id}
                      onClick={() => setActiveRoomId(room.id)}
                      className={`
                        h-24 rounded-lg flex flex-col items-center justify-center
                        text-white cursor-pointer transition shadow-sm hover:opacity-90
                        ${statusColors[room.status]}
                        ${isActive ? "ring-4 ring-slate-900 scale-105 z-10 shadow-lg" : ""}
                      `}
                    >
                      <span className="text-xl font-bold">
                        {room.number}
                      </span>
                      <span className="text-xs uppercase tracking-wider opacity-90 font-semibold">
                        {room.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {!activeRoom ? (
            <Card className="h-full flex items-center justify-center border-dashed text-slate-400 font-semibold min-h-[400px]">
              Select a room to begin.
            </Card>
          ) : (
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b bg-slate-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold">
                    Room {activeRoom.number}
                  </CardTitle>
                  <Badge className={statusColors[activeRoom.status]}>
                    {activeRoom.status}
                  </Badge>
                </div>
                {activeRoom.guest && (
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    Guest: <span className="text-slate-900">{activeRoom.guest}</span>
                  </p>
                )}
              </CardHeader>

              <CardContent className="p-6 flex flex-col gap-8 h-full">
                {activeRoom.status === "Clean" ? (
                  <div className="space-y-3">
                    <h3 className="font-bold border-b pb-2 text-slate-700">
                      Check-in Guest
                    </h3>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Guest Name</label>
                        <Input
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="bg-slate-50"
                        />
                    </div>
                    <Button 
                        onClick={checkInGuest} 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 font-bold mt-2 text-white"
                    >
                      {loading ? "Generating Code..." : "Generate Access Code"}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-slate-100 p-4 rounded-lg text-center text-sm font-medium text-slate-500">
                    Room must be marked clean before assigning a guest.
                  </div>
                )}

                <div className="space-y-3 mt-auto">
                  <h3 className="font-bold border-b pb-2 text-rose-500">
                    Maintenance
                  </h3>
                  <Input
                    value={maintenanceNote}
                    onChange={(e) => setMaintenanceNote(e.target.value)}
                    placeholder="Describe the issue..."
                    className="bg-slate-50"
                  />
                  <Button variant="outline" className="w-full font-bold" onClick={logMaintenance}>
                    Submit Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}