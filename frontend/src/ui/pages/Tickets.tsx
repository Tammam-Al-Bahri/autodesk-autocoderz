import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Tickets() {
    const [ticket_list, set_ticket_list] = useState([
        { 
            id: 2981, 
            hotel: "The Grand Plaza", 
            room: "Room 302", 
            issue: "Bathroom sink is leaking water everywhere", 
            state: "Open",
            reported: "2 hours ago"
        },
        { 
            id: 5521, 
            hotel: "Riverside Lodge", 
            room: "Main Lobby", 
            issue: "AC unit making a loud grinding noise", 
            state: "Open",
            reported: "5 hours ago"
        },
        { 
            id: 1109, 
            hotel: "Oceanview Resort", 
            room: "Room 105", 
            issue: "Guest says TV remote is missing", 
            state: "Resolved",
            reported: "1 day ago"
        }
    ]);

    const [current_filter, set_filter] = useState("All");

    const filtered_data = ticket_list.filter(item => {
        if (current_filter === "All") {
            return true;
        } else {
            return item.state === current_filter;
        }
    });

    const mark_as_done = (id_to_fix: number) => {
        const updated = ticket_list.map(t => {
            if (t.id === id_to_fix) {
                return { ...t, state: "Resolved" };
            }
            return t;
        });
        
        set_ticket_list(updated);
        console.log("Ticket updated successfully");
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 px-4 pb-20">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tight">Maintenance</h1>
                    <p className="text-slate-500">Manage reported faults across the franchise.</p>
                </div>
                
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                    <Button 
                        size="sm"
                        variant={current_filter === "All" ? "default" : "ghost"} 
                        onClick={() => set_filter("All")}
                    >
                        Show All
                    </Button>
                    <Button 
                        size="sm"
                        variant={current_filter === "Open" ? "default" : "ghost"} 
                        onClick={() => set_filter("Open")}
                    >
                        Open
                    </Button>
                    <Button 
                        size="sm"
                        variant={current_filter === "Resolved" ? "default" : "ghost"} 
                        onClick={() => set_filter("Resolved")}
                    >
                        Fixed
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {filtered_data.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <p className="text-slate-400 font-medium">No tickets found for "{current_filter}"</p>
                    </div>
                ) : (
                    filtered_data.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-l-4 border-l-slate-300">
                            <CardContent className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-xs font-bold text-slate-400">#{item.id}</span>
                                        <h3 className="font-bold text-lg">{item.hotel} — {item.room}</h3>
                                        <Badge variant={item.state === "Open" ? "destructive" : "outline"}>
                                            {item.state}
                                        </Badge>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300">{item.issue}</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-2 tracking-widest">
                                        Added {item.reported}
                                    </p>
                                </div>

                                {item.state === "Open" && (
                                    <Button onClick={() => mark_as_done(item.id)} className="font-bold">
                                        Resolve Fault
                                    </Button>
                                )}

                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}