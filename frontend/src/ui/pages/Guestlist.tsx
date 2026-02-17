import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GuestList() {
    console.log("guest list loaded");

    const [guest_db, set_guest_db] = useState<any[]>([
        { id: 1, name: "John Doe", room: "102", nights: 3, code: "X9F2" },
        { id: 2, name: "Jane Smith", room: "107", nights: 1, code: "A1B2" },
        { id: 3, name: "Gordon Freeman", room: "204", nights: 5, code: "HL3C" }
    ]);

    const [search_text, set_search_text] = useState("");

    function do_checkout(guest_id: any, room_num: any) {
        var answer = window.confirm("Check out guest from Room " + room_num + "? This will mark the room as Dirty.");
        
        if (answer == true) {
            let updated = [];
            for (let i = 0; i < guest_db.length; i++) {
                if (guest_db[i].id != guest_id) {
                    updated.push(guest_db[i]);
                }
            }
            
            set_guest_db(updated);
            alert("Room " + room_num + " checked out successfully. Cleaners notified.");
        }
    }

    let visible_guests = [];
    if (search_text == "") {
        visible_guests = guest_db;
    } else {
        for (let i = 0; i < guest_db.length; i++) {
            let g = guest_db[i];
            if (g.name.toLowerCase().includes(search_text.toLowerCase()) || g.room.includes(search_text)) {
                visible_guests.push(g);
            }
        }
    }

    return (
        <div className="max-w-5xl mx-auto mt-8 px-4 mb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 style={{ fontSize: '30px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '4px' }}>
                        Guest Directory
                    </h1>
                    <p style={{ color: 'gray' }}>Manage current check-ins and perform check-outs.</p>
                </div>
                
                <div className="w-full md:w-72">
                    <Input 
                        placeholder="Search name or room..." 
                        value={search_text}
                        onChange={(e) => set_search_text(e.target.value)}
                        style={{ border: '2px solid #e2e8f0' }}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {visible_guests.length == 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#94a3b8', fontWeight: 'bold' }}>
                        No guests found.
                    </div>
                ) : (
                    visible_guests.map(g => (
                        <Card key={g.id} style={{ borderLeft: '4px solid #3b82f6' }}>
                            <CardContent className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold">{g.name}</h3>
                                    <p className="text-sm font-medium" style={{ color: 'gray' }}>
                                        Room {g.room} • {g.nights} Nights • Code: <span style={{ fontFamily: 'monospace', backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', color: 'black' }}>{g.code}</span>
                                    </p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    style={{ color: '#dc2626', borderColor: '#fca5a5' }} 
                                    onClick={() => do_checkout(g.id, g.room)}
                                >
                                    Check Out
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}