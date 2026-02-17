import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Tickets() {
    const [issues, set_issues] = useState([
        { 
            id: 401, 
            prop: "Hotel1", 
            area: "Room 302", 
            desc: "Bathroom sink is leaking water everywhere", 
            status: "Open",
            time: "2 hours ago"
        },
        { 
            id: 402, 
            prop: "Hotel2", 
            area: "Main Lobby", 
            desc: "AC unit making a loud grinding noise", 
            status: "Open",
            time: "5 hours ago"
        },
        { 
            id: 403, 
            prop: "Hotel3", 
            area: "Room 105", 
            desc: "Guest says TV remote is missing", 
            status: "Resolved",
            time: "1 day ago"
        }
    ]);

    const [filter, set_filter] = useState("All");

    let displayed_issues = issues;
    if (filter !== "All") {
        displayed_issues = issues.filter(x => x.status === filter);
    }

    const resolve_issue = (ticket_id: number) => {
        const updated_list = issues.map(item => {
            if (item.id === ticket_id) {
                return { ...item, status: "Resolved" };
            }
            return item;
        });
        
        set_issues(updated_list);
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 px-4 mb-20">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Maintenance Tickets</h1>
                    <p className="text-slate-500">
                        Track and manage reported faults across all active properties.
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        variant={filter === "All" ? "default" : "outline"} 
                        onClick={() => set_filter("All")}
                    >
                        All
                    </Button>
                    <Button 
                        variant={filter === "Open" ? "default" : "outline"} 
                        onClick={() => set_filter("Open")}
                    >
                        Open
                    </Button>
                    <Button 
                        variant={filter === "Resolved" ? "default" : "outline"} 
                        onClick={() => set_filter("Resolved")}
                    >
                        Resolved
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {displayed_issues.length === 0 ? (
                    <p className="text-slate-500 text-center py-10">No tickets found for this filter.</p>
                ) : (
                    displayed_issues.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg">{item.prop} - {item.area}</h3>
                                        <Badge variant={item.status === "Open" ? "destructive" : "secondary"}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <p className="text-slate-600 mb-2">{item.desc}</p>
                                    <p className="text-xs text-slate-400">Reported {item.time} • Ticket #{item.id}</p>
                                </div>

                                {item.status === "Open" && (
                                    <Button variant="outline" onClick={() => resolve_issue(item.id)}>
                                        Mark Resolved
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