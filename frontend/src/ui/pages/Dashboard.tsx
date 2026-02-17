import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const [fake_hotels, set_fake_hotels] = useState([
        { 
            id: "h_1", 
            name: "HOTEL1", 
            check_ins: 12, 
            check_outs: 8, 
            occ: "82%", 
            tickets: 3 
        },
        { 
            id: "h_2", 
            name: "HOTEL2", 
            check_ins: 45, 
            check_outs: 30, 
            occ: "95%", 
            tickets: 14 
        },
        { 
            id: "h_3", 
            name: "HOTEL3", 
            check_ins: 5, 
            check_outs: 2, 
            occ: "45%", 
            tickets: 1 
        }
    ]);

    const [active_id, set_id] = useState("h_1");

    let current_hotel = fake_hotels.find(x => x.id === active_id);
    if (!current_hotel) {
        current_hotel = fake_hotels[0];
    }

    return (
        <div className="max-w-7xl mx-auto px-4 mt-8 mb-20">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Property Overview</h1>
                    <p className="text-slate-500 mt-1">
                        Select a property to view live stats and 3D models.
                    </p>
                </div>
                
                <div className="flex flex-col gap-1 w-full md:w-64">
                    <label htmlFor="h_select" className="text-sm font-bold text-slate-500">
                        Current Property:
                    </label>
                    <select 
                        id="h_select"
                        value={active_id}
                        onChange={(e) => {
                            set_id(e.target.value);
                        }}
                        className="p-2 border-2 rounded-md bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold cursor-pointer"
                    >
                        {fake_hotels.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-bold text-slate-500">TODAY'S CHECK-INS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold">{current_hotel.check_ins}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-bold text-slate-500">TODAY'S CHECK-OUTS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold">{current_hotel.check_outs}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-bold text-slate-500">CURRENT OCCUPANCY</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold">{current_hotel.occ}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-bold text-slate-500">OPEN TICKETS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold" style={{ color: current_hotel.tickets > 10 ? 'red' : 'inherit' }}>
                            {current_hotel.tickets}
                        </p>
                    </CardContent>
                </Card>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <Card className="lg:col-span-2 flex flex-col items-center justify-center min-h-[450px] border border-dashed border-slate-400 bg-slate-50 dark:bg-slate-900">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-slate-400 mb-2">
                            Autodesk Forge Viewer
                        </p>
                        <p className="text-slate-500">
                            Loading 3D model for: <br/> 
                            <span className="font-bold text-lg text-black dark:text-white">{current_hotel.name}</span>
                        </p>
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Recent Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="flex flex-col gap-4">
                            <li className="border-b pb-2">
                                <p className="font-bold">Room 302 - Leak</p>
                                <p className="text-xs text-slate-500">Reported 2 hours ago</p>
                            </li>
                            <li className="border-b pb-2">
                                <p className="font-bold">Room 105 - Broken AC</p>
                                <p className="text-xs text-slate-500">Reported 5 hours ago</p>
                            </li>
                            <li>
                                <p className="font-bold">Lobby - Lighting</p>
                                <p className="text-xs text-slate-500">Reported 1 day ago</p>
                            </li>
                        </ul>
                        
                        <Button 
                            variant="outline" 
                            className="w-full mt-6"
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