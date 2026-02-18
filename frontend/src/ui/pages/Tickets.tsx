import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Tickets() {

  const [tickets, setTickets] = useState([
    {
      id: 2981,
      hotel: "Grand Plaza",
      room: "302",
      issue: "Bathroom sink leaking everywhere",
      status: "Open",
      time: "2 hrs ago"
    },
    {
      id: 5521,
      hotel: "Riverside Lodge",
      room: "Lobby",
      issue: "AC making weird grinding noise",
      status: "Open",
      time: "5 hrs ago"
    },
    {
      id: 1109,
      hotel: "Oceanview Resort",
      room: "105",
      issue: "TV remote missing",
      status: "Resolved",
      time: "Yesterday"
    }
  ]);

  const [filter, setFilter] = useState("All");

  function markDone(id: number) {
    const copy = [...tickets];

    for (let i = 0; i < copy.length; i++) {
      if (copy[i].id === id) {
        copy[i].status = "Resolved";
      }
    }

    setTickets(copy);
  }

  const shownTickets =
    filter === "All"
      ? tickets
      : tickets.filter(t => t.status === filter);

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-16">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Maintenance Tickets</h1>
        <p className="text-sm text-gray-500">
          View and update reported issues.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          size="sm"
          onClick={() => setFilter("All")}
          variant={filter === "All" ? "default" : "outline"}
        >
          All
        </Button>

        <Button
          size="sm"
          onClick={() => setFilter("Open")}
          variant={filter === "Open" ? "default" : "outline"}
        >
          Open
        </Button>

        <Button
          size="sm"
          onClick={() => setFilter("Resolved")}
          variant={filter === "Resolved" ? "default" : "outline"}
        >
          Resolved
        </Button>
      </div>

      {shownTickets.length === 0 && (
        <div className="border p-6 text-center text-gray-400">
          Nothing here.
        </div>
      )}

      {shownTickets.map((t) => (
        <Card key={t.id} className="mb-4">
          <CardContent className="p-4">

            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-xs text-gray-400">#{t.id}</p>
                <h3 className="font-semibold">
                  {t.hotel} - Room {t.room}
                </h3>
              </div>

              <Badge variant={t.status === "Open" ? "destructive" : "secondary"}>
                {t.status}
              </Badge>
            </div>

            <p className="text-sm mb-2">{t.issue}</p>
            <p className="text-xs text-gray-400 mb-3">{t.time}</p>

            {t.status === "Open" && (
              <Button size="sm" onClick={() => markDone(t.id)}>
                Mark as Fixed
              </Button>
            )}

          </CardContent>
        </Card>
      ))}

    </div>
  );
}
