import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Receptionist() {
    const [room_list, set_room_list] = useState<any[]>([
        { id: 101, number: "101", status: "Clean", guest: "" },
        { id: 102, number: "102", status: "Occupied", guest: "John Doe" },
        { id: 103, number: "103", status: "Dirty", guest: "" },
        { id: 104, number: "104", status: "Clean", guest: "" },
        { id: 105, number: "105", status: "Clean", guest: "" },
        { id: 106, number: "106", status: "Dirty", guest: "" },
        { id: 107, number: "107", status: "Occupied", guest: "Jane Smith" },
        { id: 108, number: "108", status: "Clean", guest: "" },
    ]);

    const [selected_room, set_selected_room] = useState<any>(null);
    
    const [guest_name, set_guest_name] = useState("");
    const [issue_text, set_issue_text] = useState("");

    function assign_guest() {
        if (guest_name.trim() == "") {
            alert("Please enter a guest name first!");
            return;
        }

        let login_code = Math.random().toString(36).substring(2, 6).toUpperCase();

        let updated = [];
        for(let i=0; i < room_list.length; i++){
            let current = room_list[i];
            if(current.id == selected_room.id){
                current.status = "Occupied";
                current.guest = guest_name;
            }
            updated.push(current);
        }

        set_room_list(updated);
        
        set_selected_room({ ...selected_room, status: "Occupied", guest: guest_name });
        set_guest_name("");
        
        alert("Success! Guest assigned. Their room login code is: " + login_code);
    }

    const report_fault = () => {
        if (issue_text.trim() == "") {
            alert("Please describe the issue.");
            return;
        }

        alert("Ticket logged for Room " + selected_room.number + ": '" + issue_text + "'. Staff have been notified.");
        set_issue_text("");
    };

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4 mb-20">
            
            <div className="mb-8 border-b pb-4">
                <h1 style={{ fontSize: '30px', fontWeight: '900', letterSpacing: '-1px' }}>Front Desk: Room Status</h1>
                <p style={{ color: 'gray', marginTop: '8px' }}>
                    Live floor plan overview. Click on a room to assign guests or log maintenance tickets.
                </p>
                
                <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2"><div style={{ width: '16px', height: '16px', backgroundColor: '#22c55e', borderRadius: '4px' }}></div> <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray' }}>Clean</span></div>
                    <div className="flex items-center gap-2"><div style={{ width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '4px' }}></div> <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray' }}>Dirty</span></div>
                    <div className="flex items-center gap-2"><div style={{ width: '16px', height: '16px', backgroundColor: '#3b82f6', borderRadius: '4px' }}></div> <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray' }}>Occupied</span></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2">
                    <Card style={{ backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
                        <CardHeader>
                            <CardTitle style={{ color: '#94a3b8' }}>Floor 1 Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {room_list.map((room) => {
                                    
                                    let bg_color = "#e2e8f0";
                                    let text_color = "black";
                                    
                                    if (room.status == "Clean") {
                                        bg_color = "#22c55e"; 
                                        text_color = "white";
                                    }
                                    if (room.status == "Dirty") {
                                        bg_color = "#ef4444"; 
                                        text_color = "white";
                                    }
                                    if (room.status == "Occupied") {
                                        bg_color = "#3b82f6"; 
                                        text_color = "white";
                                    }

                                    let is_active = false;
                                    if(selected_room != null && selected_room.id == room.id) {
                                        is_active = true;
                                    }

                                    return (
                                        <div 
                                            key={room.id}
                                            onClick={() => set_selected_room(room)}
                                            style={{
                                                height: '96px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: bg_color,
                                                color: text_color,
                                                border: is_active ? '3px solid black' : '3px solid transparent',
                                                transform: is_active ? 'scale(1.05)' : 'none',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <span style={{ fontSize: '24px', fontWeight: '900' }}>{room.number}</span>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>{room.status}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    {selected_room == null ? (
                        <Card style={{ height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', color: '#94a3b8', fontWeight: 'bold' }}>
                            Select a room on the map.
                        </Card>
                    ) : (
                        <Card className="h-full flex flex-col">
                            <CardHeader className="border-b bg-slate-50 dark:bg-slate-900 rounded-t-xl">
                                <div className="flex justify-between items-start">
                                    <CardTitle style={{ fontSize: '24px', fontWeight: '900' }}>Room {selected_room.number}</CardTitle>
                                    <Badge variant={selected_room.status == "Clean" ? "default" : selected_room.status == "Dirty" ? "destructive" : "secondary"}>
                                        {selected_room.status}
                                    </Badge>
                                </div>
                                {selected_room.guest != "" ? <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray', marginTop: '4px' }}>Current Guest: {selected_room.guest}</p> : null}
                            </CardHeader>

                            <CardContent className="p-6 flex flex-col gap-8">
                                
                                {selected_room.status == "Clean" ? (
                                    <div className="space-y-3">
                                        <h3 style={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Check-in Guest</h3>
                                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'gray' }}>Guest Full Name</label>
                                        <Input 
                                            value={guest_name} 
                                            onChange={(e) => set_guest_name(e.target.value)} 
                                            placeholder="e.g. Gordon Freeman" 
                                        />
                                        <Button style={{ width: '100%', backgroundColor: '#2563eb', color: 'white' }} onClick={assign_guest}>
                                            Confirm & Generate Code
                                        </Button>
                                    </div>
                                ) : (
                                    <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '6px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '14px', color: 'gray', fontWeight: 'bold' }}>Room cannot be assigned.</p>
                                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Must be marked as Clean.</p>
                                    </div>
                                )}

                                <div className="space-y-3 mt-auto">
                                    <h3 style={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', color: '#ef4444' }}>Log Maintenance Issue</h3>
                                    <Input 
                                        value={issue_text} 
                                        onChange={(e) => set_issue_text(e.target.value)} 
                                        placeholder="e.g. Lightbulb blown in bathroom" 
                                    />
                                    <Button variant="outline" style={{ width: '100%', color: '#ef4444', borderColor: '#fca5a5' }} onClick={report_fault}>
                                        Send to Manager Tickets
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