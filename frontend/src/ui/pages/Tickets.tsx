import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ticketsBase } from "@autocoderz/shared";
import { apiFetch } from "@/lib/utils";

interface Ticket {
  id: string;
  hotel: string;
  room: string;
  issue: string;
  status: "Open" | "In Progress" | "Resolved";
  time: string;
  priority: "Low" | "Med" | "High";
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // load tickets
  const loadTickets = async () => {
    setLoading(true);

    try {
      const res: any = await apiFetch(ticketsBase);

      if (res?.data) {
        setTickets(res.data);
      } else {
        console.log("no tickets found");
      }
    } catch (err) {
      console.error("failed to load tickets", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // mark as resolved
  const handleResolve = async (id: string) => {
    try {
      await apiFetch(ticketsBase, {
        method: "PATCH",
        body: JSON.stringify({
          id,
          status: "Resolved",
        }),
      });

      // update locally
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "Resolved" } : t
        )
      );
    } catch (err) {
      console.log("update failed");
    }
  };

  // filter tickets
  let visibleTickets = tickets;
  if (filter !== "All") {
    visibleTickets = tickets.filter((t) => t.status === filter);
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Maintenance Feed
          </h1>
          <p className="text-slate-500 text-sm">
            Real-time status of building repairs.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadTickets}
          className="rounded-full font-bold px-6 border-2"
        >
          {loading ? "Syncing..." : "Refresh"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {["All", "Open", "Resolved"].map((f) => (
          <Button
            key={f}
            onClick={() => setFilter(f)}
            variant={filter === f ? "default" : "secondary"}
            className={`rounded-full px-8 text-xs font-bold uppercase tracking-widest ${
              filter === f
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {f}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 animate-pulse font-mono text-xs">
          INITIALISING_FEED...
        </div>
      ) : visibleTickets.length === 0 ? (
        <div className="border-2 border-dashed rounded-3xl py-32 text-center text-slate-400 bg-slate-50/50">
          <p className="font-medium">No maintenance tasks found.</p>
          <p className="text-[10px] mt-1 uppercase opacity-50">
            Database is current
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {visibleTickets.map((t) => (
            <Card
              key={t.id}
              className="border-none shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
                
                <div
                  className={`h-1.5 w-full ${
                    t.status === "Open"
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                />

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {t.hotel}
                        <span className="text-slate-300 px-1">/</span>
                        {t.room}
                      </h3>

                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                        Ref: {t.id.slice(-8)}
                      </p>
                    </div>

                    <Badge
                      variant={t.status === "Open" ? "destructive" : "secondary"}
                      className="rounded-md font-bold px-3 py-1"
                    >
                      {t.status}
                    </Badge>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-5 border border-slate-100/50">
                    <p className="text-sm text-slate-600 italic">
                      "{t.issue}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Logged:{" "}
                        <span className="text-slate-700">{t.time}</span>
                      </span>

                      <span
                        className={`text-[9px] px-2 py-1 rounded font-black uppercase ${
                          t.priority === "High"
                            ? "bg-red-50 text-red-600"
                            : t.priority === "Med"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    {t.status === "Open" && (
                      <Button
                        size="sm"
                        onClick={() => handleResolve(t.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-9 px-6 rounded-lg text-[10px] uppercase shadow-sm"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}