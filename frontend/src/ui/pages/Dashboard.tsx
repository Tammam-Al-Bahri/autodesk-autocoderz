import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertCircle,
    ChevronRight,
    Building2,
    ClipboardCheck,
    Clock,
    LayoutDashboard,
    ArrowRight,
    Loader2
} from "lucide-react";
import { cn, apiFetch, apiUrl } from "@/lib/utils";
import { buildingsBase, buildingGroupsBase, ticketsBase, type Building } from "@autocoderz/shared";
import { toast } from "sonner";

interface Ticket {
    id: string;
    hotel: string;
    room: string;
    issue: string;
    status: "Open" | "In Progress" | "Resolved";
    time: string;
    priority: "Low" | "Med" | "High";
}

const getDisplayName = (name: string, type: string) => {
    if (type?.toUpperCase() === "OTHER" && name.includes(" - ")) {
        const parts = name.split(" - ");
        parts.pop(); 
        return parts.join(" - "); 
    }
    return name;
};

const getDisplayType = (name: string, type: string) => {
    if (type?.toUpperCase() === "OTHER" && name.includes(" - ")) {
        return name.split(" - ").pop(); 
    }
    return type?.replace(/_/g, ' ') || "Unknown";
};

const getStatusColors = (status: string) => {
    const s = status?.toUpperCase() || "";
    if (s === "ACTIVE") return { dot: "bg-emerald-500", bg: "bg-emerald-50" };
    if (s === "INACTIVE") return { dot: "bg-rose-500", bg: "bg-rose-50" };
    if (s === "DRAFT") return { dot: "bg-orange-500", bg: "bg-orange-50" };
    return { dot: "bg-slate-400", bg: "bg-slate-50" };
};

export default function Dashboard() {
    const [companies, setCompanies] = useState<{ id: string, name: string }[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    
    const [compId, setCompId] = useState("");
    const [buildId, setBuildId] = useState("");
    
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [loadingBuildings, setLoadingBuildings] = useState(false);
    const [loadingTickets, setLoadingTickets] = useState(false);

    useEffect(() => {
        async function fetchCompanies() {
            try {
                const res = await apiFetch(`${apiUrl}${buildingGroupsBase}`);
                const json = await res.json();
                if (res.ok) {
                    setCompanies(json.data || []);
                } else {
                    toast.error("Failed to load portfolio groups");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingCompanies(false);
            }
        }
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (!compId) {
            setBuildings([]);
            setBuildId("");
            return;
        }

        async function fetchBuildings() {
            setLoadingBuildings(true);
            try {
                const res = await apiFetch(`${apiUrl}${buildingsBase}?buildingGroupId=${compId}`);
                const json = await res.json();
                if (res.ok) {
                    setBuildings(json.data || []);
                }
            } catch (err) {
                toast.error("Error fetching buildings");
            } finally {
                setLoadingBuildings(false);
            }
        }
        fetchBuildings();
    }, [compId]);

    useEffect(() => {
        if (!buildId) {
            setTickets([]);
            return;
        }

        async function fetchTickets() {
            setLoadingTickets(true);
            try {
                const res = await apiFetch(`${apiUrl}${ticketsBase}?buildingId=${buildId}`);
                const json = await res.json();
                if (res.ok) {
                    setTickets(json.data || []);
                }
            } catch (err) {
                console.error("Ticket sync error:", err);
            } finally {
                setLoadingTickets(false);
            }
        }
        fetchTickets();
    }, [buildId]);

    const selectedBuilding = buildings.find(b => b.id === buildId);
    const statusColors = getStatusColors(selectedBuilding?.status || "");
    
    const activeTicketsCount = tickets.filter(t => t.status === "Open").length;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <div className="bg-white border-b border-slate-200 mb-8 pt-8 pb-6 px-4 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                            <LayoutDashboard className="text-blue-600 w-8 h-8" />
                            Manager Dashboard
                        </h1>
                        <p className="text-slate-500 font-medium tracking-tight">Real-time property asset management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
                            <div className="relative">
                                <select
                                    value={compId}
                                    onChange={(e) => setCompId(e.target.value)}
                                    disabled={loadingCompanies}
                                    className="bg-slate-100 h-11 px-4 pr-10 rounded-xl text-slate-900 font-bold cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none border-none min-w-[200px] appearance-none"
                                >
                                    <option value="">{loadingCompanies ? "Loading..." : "Select Portfolio..."}</option>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {loadingCompanies && <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-slate-400" />}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Building Asset</label>
                            <div className="relative">
                                <select
                                    value={buildId}
                                    disabled={!compId || loadingBuildings}
                                    onChange={(e) => setBuildId(e.target.value)}
                                    className={cn(
                                        "h-11 px-4 pr-10 rounded-xl font-bold cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none border-none min-w-[200px] appearance-none transition-all",
                                        !compId ? "bg-slate-50 text-slate-300" : "bg-slate-100 text-slate-900"
                                    )}
                                >
                                    <option value="">{loadingBuildings ? "Loading Assets..." : "Select Building..."}</option>
                                    {buildings.map(b => (
                                        <option key={b.id} value={b.id}>
                                            {getDisplayName(b.name, b.type)}
                                        </option>
                                    ))}
                                </select>
                                {loadingBuildings && <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-slate-400" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {!selectedBuilding ? (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-3xl flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-slate-300" />
                        </div>
                        <div className="max-w-xs">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Initialise View</h3>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Please select a property from your portfolio to synchronise live building data.</p>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard 
                                title="Active Status" 
                                value={selectedBuilding.status.replace('_', ' ')} 
                                icon={<div className={cn("w-2 h-2 rounded-full animate-pulse", statusColors.dot)} />} 
                                color={statusColors.bg} 
                            />
                            
                            <StatCard title="Asset Type" value={getDisplayType(selectedBuilding.name, selectedBuilding.type)} icon={<Building2 className="text-blue-600 w-5 h-5" />} />
                            
                            <StatCard title="Address" value={selectedBuilding.address} isSmall icon={<Clock className="text-slate-400 w-5 h-5" />} />
                            
                            <StatCard 
                                title="Tickets" 
                                value={loadingTickets ? "..." : `${activeTicketsCount} Active`} 
                                icon={<AlertCircle className="text-rose-600 w-5 h-5" />} 
                                color="bg-rose-50" 
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 bg-slate-900 shadow-2xl border-none relative min-h-[450px] group overflow-hidden rounded-3xl">
                                <div className="absolute top-6 left-6 flex gap-2 z-10">
                                    <Badge className="bg-blue-600 text-white border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest">Live Digital Twin</Badge>
                                </div>
                                <CardContent className="h-full flex items-center justify-center flex-col p-12 text-center">
                                    <div className="space-y-6">
                                        <div className="w-24 h-24 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
                                            <Building2 className="w-12 h-12 text-blue-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.4em]">Metadata Synchronised</p>
                                            <h4 className="text-white font-black text-3xl tracking-tighter uppercase">
                                                {getDisplayName(selectedBuilding.name, selectedBuilding.type)}
                                            </h4>
                                            <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">Virtualisation engine ready. Access the 3D BIM model for structural analysis and maintenance hotspots.</p>
                                        </div>
                                        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-widest px-8 h-12 rounded-xl">
                                            Enter 3D Viewer <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-xl border-none bg-white rounded-3xl overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 pt-8 px-8">
                                    <CardTitle className="text-lg flex items-center font-black uppercase tracking-tight">
                                        <ClipboardCheck className="w-5 h-5 mr-3 text-blue-600" />
                                        Maintenance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-8">
                                        {loadingTickets ? (
                                            <div className="flex items-center justify-center py-10">
                                                <Loader2 className="w-6 h-6 animate-spin text-slate-200" />
                                            </div>
                                        ) : tickets.length === 0 ? (
                                            <p className="text-xs text-slate-400 text-center font-medium italic">No active maintenance tickets.</p>
                                        ) : (
                                            tickets.slice(0, 4).map((ticket) => (
                                                <TicketItem 
                                                    key={ticket.id}
                                                    title={ticket.issue} 
                                                    time={`Logged ${ticket.time}`} 
                                                    priority={ticket.priority} 
                                                />
                                            ))
                                        )}
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => window.location.href = '/tickets'} // Update with your actual route
                                        className="w-full mt-10 border-slate-200 hover:bg-slate-50 text-slate-600 font-black uppercase text-[10px] tracking-widest h-11 rounded-xl"
                                    >
                                        View All Tickets <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color = "bg-slate-50", isSmall = false }: any) {
    return (
        <Card className="shadow-sm border-none hover:shadow-md transition-all bg-white rounded-2xl overflow-hidden flex flex-col justify-between">
            <CardContent className="p-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2.5 rounded-xl", color)}>{icon}</div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                </div>
                <p className={cn("font-black text-slate-900 tracking-tight", isSmall ? "text-sm break-words" : "text-2xl break-words")}>
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}

function TicketItem({ title, time, priority }: any) {
    const dotColor = priority === "High" ? "bg-rose-500" : priority === "Med" ? "bg-amber-400" : "bg-blue-400";
    return (
        <div className="flex justify-between items-start group cursor-pointer">
            <div className="space-y-1 pr-4">
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1">{title}</p>
                <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-wider">
                    <Clock className="w-3 h-3 mr-1.5 opacity-50" /> {time}
                </div>
            </div>
            <div className={`shrink-0 w-2 h-2 rounded-full ${dotColor} mt-1.5 shadow-sm shadow-black/10`} />
        </div>
    );
}