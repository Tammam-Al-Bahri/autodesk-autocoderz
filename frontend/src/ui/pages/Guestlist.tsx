import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GuestList() {

  const [guests, setGuests] = useState([
    { id: 1, name: "John D", room: "102", nights: 3, code: "X9F2" },
    { id: 2, name: "Jane S", room: "107", nights: 1, code: "A1B2" },
    { id: 3, name: "G Freeman", room: "204", nights: 5, code: "HL3C" }
  ]);

  const [search, setSearch] = useState("");

  function checkout(id: number, room: string) {
    const confirmBox = window.confirm("Check out guest in room " + room + "?");

    if (confirmBox) {
      const updated = guests.filter(g => g.id !== id);
      setGuests(updated);
      alert("Guest removed. Room " + room + " now needs cleaning.");
    }
  }

  let listToShow = guests;

  if (search !== "") {
    listToShow = guests.filter(g =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.room.includes(search)
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-16">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Guest List</h1>
        <p className="text-sm text-gray-500">
          Current checked-in guests
        </p>
      </div>

      <div className="mb-6 max-w-sm">
        <Input
          placeholder="Search by name or room"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {listToShow.length === 0 && (
        <div className="border p-6 text-center text-gray-400">
          No guests found
        </div>
      )}

      <div className="space-y-3">
        {listToShow.map((g) => (
          <Card key={g.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">

              <div>
                <h3 className="font-semibold text-lg">{g.name}</h3>
                <p className="text-sm text-gray-500">
                  Room {g.room} • {g.nights} nights
                </p>
                <p className="text-xs text-gray-400">
                  Code: {g.code}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => checkout(g.id, g.room)}
              >
                Check Out
              </Button>

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
