import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type RoomStatus = "Clean" | "Dirty" | "Occupied";

interface Room {
  id: number;
  number: string;
  status: RoomStatus;
  guest?: string;
}

const initialRooms: Room[] = [
  { id: 1, number: "101", status: "Clean" },
  { id: 2, number: "102", status: "Occupied", guest: "Mr Thompson" },
  { id: 3, number: "103", status: "Dirty" },
  { id: 4, number: "104", status: "Clean" },
  { id: 5, number: "105", status: "Clean" },
  { id: 6, number: "106", status: "Dirty" },
  { id: 7, number: "107", status: "Occupied", guest: "A. Patel" },
  { id: 8, number: "108", status: "Clean" },
];

const statusColors: Record<RoomStatus, string> = {
  Clean: "bg-green-500",
  Dirty: "bg-red-500",
  Occupied: "bg-blue-500",
};

export default function Receptionist() {
  const [rooms, setRooms] = useState(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [guestName, setGuestName] = useState("");
  const [maintenanceNote, setMaintenanceNote] = useState("");

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || null;

  const checkInGuest = () => {
    if (!activeRoom || !guestName.trim()) return;

    const code = Math.random().toString(36).slice(2, 6).toUpperCase();

    setRooms((prev) =>
      prev.map((room) =>
        room.id === activeRoom.id
          ? { ...room, status: "Occupied", guest: guestName }
          : room
      )
    );

    setGuestName("");
    alert(`Checked in. Login code: ${code}`);
  };

  const logMaintenance = () => {
    if (!activeRoom || !maintenanceNote.trim()) return;

    console.log(
      `Maintenance request for ${activeRoom.number}: ${maintenanceNote}`
    );

    setMaintenanceNote("");
    alert("Maintenance team notified.");
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
                Floor 1 Overview
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
                        text-white cursor-pointer transition
                        ${statusColors[room.status]}
                        ${isActive ? "ring-4 ring-black scale-105" : ""}
                      `}
                    >
                      <span className="text-xl font-bold">
                        {room.number}
                      </span>
                      <span className="text-xs uppercase tracking-wider opacity-90">
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
            <Card className="h-full flex items-center justify-center border-dashed text-slate-400 font-semibold">
              Select a room to begin.
            </Card>
          ) : (
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b bg-slate-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold">
                    Room {activeRoom.number}
                  </CardTitle>
                  <Badge>{activeRoom.status}</Badge>
                </div>
                {activeRoom.guest && (
                  <p className="text-sm text-gray-500 mt-1">
                    Guest: {activeRoom.guest}
                  </p>
                )}
              </CardHeader>

              <CardContent className="p-6 flex flex-col gap-8">
                {activeRoom.status === "Clean" ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold border-b pb-1">
                      Check-in Guest
                    </h3>
                    <Input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Guest full name"
                    />
                    <Button onClick={checkInGuest}>
                      Check In
                    </Button>
                  </div>
                ) : (
                  <div className="bg-slate-100 p-4 rounded text-center text-sm text-gray-500">
                    Room must be marked clean before assigning a guest.
                  </div>
                )}

                <div className="space-y-3 mt-auto">
                  <h3 className="font-semibold border-b pb-1 text-red-500">
                    Maintenance
                  </h3>
                  <Input
                    value={maintenanceNote}
                    onChange={(e) => setMaintenanceNote(e.target.value)}
                    placeholder="Describe the issue..."
                  />
                  <Button variant="outline" onClick={logMaintenance}>
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
