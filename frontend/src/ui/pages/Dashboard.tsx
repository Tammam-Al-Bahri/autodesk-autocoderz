import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    LogIn,
    LogOut,
    BedDouble,
    AlertCircle,
    ChevronRight,
    History,
    Building2,
    Maximize2,
} from "lucide-react";

export default function Dashboard() {
    const [hotelList] = useState([
        {
            id: "1",
            name: "Grand Plaza",
            checkIns: 12,
            checkOuts: 8,
            occupancy: "82%",
            tickets: 3,
        },
        {
            id: "2",
            name: "Riverside Lodge",
            checkIns: 45,
            checkOuts: 30,
            occupancy: "95%",
            tickets: 14,
        },
        {
            id: "3",
            name: "Oceanview Resort",
            checkIns: 5,
            checkOuts: 2,
            occupancy: "45%",
            tickets: 1,
        },
    ]);

    const [selectedHotel, setSelectedHotel] = useState("1");

    const currentHotel = hotelList.find((h) => h.id === selectedHotel) || hotelList[0];

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <div className="bg-white border-b border-slate-200 mb-8 pt-8 pb-6 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Portfolio
                            <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                                {" "}
                                Overview
                            </span>
                        </h1>

                        <p className="text-slate-500 mt-1 flex items-center">
                            <Building2 className="w-4 h-4 mr-2" />
                            {hotelList.length} properties being monitored
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Selected Hotel
                        </span>

                        <select
                            value={selectedHotel}
                            onChange={(e) => setSelectedHotel(e.target.value)}
                            className="bg-slate-100 py-2 px-4 rounded-lg text-slate-900 font-semibold cursor-pointer focus:ring-2 focus:ring-blue-500"
                        >
                            {hotelList.map((hotel) => (
                                <option key={hotel.id} value={hotel.id}>
                                    {hotel.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Check Ins" value={currentHotel.checkIns} icon={<LogIn />} />

                    <StatCard title="Check Outs" value={currentHotel.checkOuts} icon={<LogOut />} />

                    <StatCard
                        title="Occupancy"
                        value={currentHotel.occupancy}
                        icon={<BedDouble />}
                    />

                    <StatCard
                        title="Open Tickets"
                        value={currentHotel.tickets}
                        icon={<AlertCircle />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 bg-slate-900 shadow-xl border-none relative min-h-[450px] group overflow-hidden">
                        <div className="absolute top-4 left-4 flex gap-2 z-10">
                            <Badge className="bg-blue-600 text-white border-none px-3">
                                Live BIM Feed
                            </Badge>

                            <Badge
                                variant="outline"
                                className="text-white border-white/20 bg-white/5 backdrop-blur"
                            >
                                {currentHotel.name}
                            </Badge>
                        </div>

                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </Button>

                        <CardContent className="h-full flex items-center justify-center flex-col p-0">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
                                    <Building2 className="w-8 h-8 text-blue-400" />
                                </div>

                                <div>
                                    <p className="text-slate-400 font-mono text-xs uppercase tracking-tighter">
                                        Connecting to digital twin...
                                    </p>

                                    <p className="text-white font-bold text-xl mt-2">
                                        {currentHotel.name}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-none bg-white">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
                            <CardTitle className="text-lg flex items-center">
                                <History className="w-5 h-5 mr-2 text-slate-400" />
                                Tickets
                            </CardTitle>

                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                {currentHotel.tickets} New
                            </Badge>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                <TicketItem title="Room 302 - Water Leak" time="2 hrs ago" />

                                <TicketItem title="Room 105 - AC Failure" time="5 hrs ago" />

                                <TicketItem title="Lobby - Flickering Lights" time="Yesterday" />
                            </div>

                            <Button
                                variant="outline"
                                className="w-full mt-8 border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
                                onClick={() => alert("Opening maintenance system...")}
                            >
                                Full Maintenance Log
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }: any) {
    return (
        <Card className="shadow-sm border-none hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-slate-100">{icon}</div>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {title}
                    </p>
                </div>

                <p className="text-3xl font-black text-slate-900">{value}</p>
            </CardContent>
        </Card>
    );
}

function TicketItem({ title, time }: any) {
    return (
        <div className="group cursor-pointer">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {title}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">{time}</p>
                </div>

                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
            </div>
        </div>
    );
}
