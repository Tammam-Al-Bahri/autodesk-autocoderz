import { useState } from "react";
import { Link } from "react-router-dom"; // unused for now
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const [fake_hotels, set_fake_hotels] = useState<any>([
        { 
            id: "h_1", 
            name: "Grand Plaza", 
            check_ins: 12, 
            check_outs: 8, 
            occ: "82%", 
            tickets: 3 
        },
        { 
            id: "h_2", 
            name: "Riverside Lodge", 
            check_ins: 45, 
            check_outs: 30, 
            occ: "95%", 
            tickets: 14
        },
        { 
            id: "h_3", 
            name: "Oceanview Resort", 
            check_ins: 5, 
            check_outs: 2, 
            occ: "45%", 
            tickets: 1 
        }
    ]);

    const [active_id, set_id] = useState("h_1");

    let current_hotel = fake_hotels[0];
    for (let i = 0; i < fake_hotels.length; i++) {
        if(fake_hotels[i].id == active_id) {
            current_hotel = fake_hotels[i];
            break;
        }
    }

    const change_hotel = (e: any) => {
        console.log("hotel changed to", e.target.value);
        set_id(e.target.value);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 mt-8 mb-20">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Property Overview</h1>
                    <p style={{ color: 'gray', marginTop: '4px' }}>
                        Select a property to view live stats and 3D models.
                    </p>
                </div>
                
                <div className="flex flex-col gap-1 w-full md:w-64">
                    <label htmlFor="h_select" style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray' }}>
                        Current Property:
                    </label>
                    <select 
                        id="h_select"
                        value={active_id}
                        onChange={change_hotel}
                        style={{ padding: '8px', border: '2px solid #cbd5e1', borderRadius: '6px', fontWeight: 'bold' }}
                    >
                        {fake_hotels.map((item: any) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle style={{ fontSize: '14px', color: 'gray' }}>TODAY'S CHECK-INS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold">{current_hotel.check_ins}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle style={{ fontSize: '14px', color: 'gray' }}>TODAY'S CHECK-OUTS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold">{current_hotel.check_outs}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle style={{ fontSize: '14px', color: 'gray' }}>CURRENT OCCUPANCY</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold">{current_hotel.occ}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle style={{ fontSize: '14px', color: 'gray' }}>OPEN TICKETS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold" style={{ color: current_hotel.tickets > 10 ? 'red' : 'inherit' }}>
                            {current_hotel.tickets}
                        </p>
                    </CardContent>
                </Card>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <Card className="lg:col-span-2 flex flex-col items-center justify-center min-h-[450px]" style={{ border: '2px dashed gray', backgroundColor: '#f8fafc' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'gray', marginBottom: '8px' }}>
                            Autodesk Forge Viewer
                        </p>
                        <p style={{ color: 'gray' }}>
                            Loading 3D model for: <br/> 
                            <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'black' }}>{current_hotel.name}</span>
                        </p>
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Recent Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="flex flex-col gap-4">
                            <li style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                                <p className="font-bold">Room 302 - Leak</p>
                                <p style={{ fontSize: '12px', color: 'gray' }}>Reported 2 hours ago</p>
                            </li>
                            <li style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                                <p className="font-bold">Room 105 - Broken AC</p>
                                <p style={{ fontSize: '12px', color: 'gray' }}>Reported 5 hours ago</p>
                            </li>
                            <li>
                                <p className="font-bold">Lobby - Lighting</p>
                                <p style={{ fontSize: '12px', color: 'gray' }}>Reported 1 day ago</p>
                            </li>
                        </ul>
                        
                        <Button 
                            variant="outline" 
                            style={{ width: '100%', marginTop: '24px' }}
                            onClick={() => alert("Going to tickets page...")}
                        >
                            View All {current_hotel.name} Tickets
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
} 