import { useState, useEffect } from "react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const formatName = (name: string, type: string) => {
    if (type === "OTHER" && name.includes(" - ")) {
        const split = name.split(" - ");
        split.pop();
        return split.join(" - ");
    }
    return name;
};

const formatType = (name: string, type: string) => {
    if (type === "OTHER" && name.includes(" - ")) {
        return name.split(" - ").pop();
    }
    return type ? type.replace(/_/g, " ") : "Unknown";
};

const getStatusStyle = (status: string) => {
    if (status === "ACTIVE") return { dot: "bg-green-500", bg: "bg-green-500/10" };
    if (status === "INACTIVE") return { dot: "bg-red-500", bg: "bg-red-500/10" };
    if (status === "DRAFT") return { dot: "bg-orange-500", bg: "bg-orange-500/10" };
    return { dot: "bg-muted-foreground", bg: "bg-muted" };
};

export default function Dashboard() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    
    const [compId, setCompId] = useState("");
    const [buildId, setBuildId] = useState("");
    
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [loadingBuildings, setLoadingBuildings] = useState(false);
    const [loadingTickets, setLoadingTickets] = useState(false);

    // load companies
    useEffect(() => {
        const loadCompanies = async () => {
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
            }
            setLoadingCompanies(false);
        };

        loadCompanies();
    }, []);

    // load buildings
    useEffect(() => {
        if (!compId) {
            setBuildings([]);
            setBuildId("");
            return;
        }

        const loadBuildings = async () => {
            setLoadingBuildings(true);
            try {
                const res = await apiFetch(`${apiUrl}${buildingsBase}?buildingGroupId=${compId}`);
                const json = await res.json();

                if (res.ok) {
                    setBuildings(json.data || []);
                }
            } catch (err) {
                toast.error("Error loading buildings");
            }
            setLoadingBuildings(false);
        };

        loadBuildings();
    }, [compId]);

    // load tickets
    useEffect(() => {
        if (!buildId) {
            setTickets([]);
            return;
        }

        const loadTickets = async () => {
            setLoadingTickets(true);
            try {
                const res = await apiFetch(`${apiUrl}${ticketsBase}?buildingId=${buildId}`);
                const json = await res.json();

                if (res.ok) {
                    setTickets(json.data || []);
                }
            } catch (err) {
                console.log("ticket error", err);
            }
            setLoadingTickets(false);
        };

        loadTickets();
    }, [buildId]);

    const selectedBuilding = buildings.find(b => b.id === buildId);
    const statusColors = getStatusStyle(selectedBuilding?.status || "");

    const activeTickets = tickets.filter(t => t.status === "Open").length;

    return (
        <div className="min-h-screen bg-background pb-16">
            <div className="bg-background border-b mb-8 pt-8 pb-6 px-4 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                            <LayoutDashboard className="text-primary w-8 h-8" />
                            Manager Dashboard
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Real-time property asset management.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        
                        {/* Company */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">
                                Company
                            </label>
                            <div className="relative">
                                <select
                                    value={compId}
                                    onChange={(e) => setCompId(e.target.value)}
                                    disabled={loadingCompanies}
                                    className="bg-muted text-foreground h-11 px-4 pr-10 rounded-xl font-bold min-w-[200px]"
                                >
                                    <option value="">
                                        {loadingCompanies ? "Loading..." : "Select Portfolio"}
                                    </option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>

                                {loadingCompanies && (
                                    <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-muted-foreground" />
                                )}
                            </div>
                        </div>

                        {/* Building */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">
                                Building
                            </label>
                            <div className="relative">
                                <select
                                    value={buildId}
                                    disabled={!compId || loadingBuildings}
                                    onChange={(e) => setBuildId(e.target.value)}
                                    className={cn(
                                        "h-11 px-4 pr-10 rounded-xl font-bold min-w-[200px]",
                                        !compId ? "bg-muted/50 text-muted-foreground" : "bg-muted text-foreground"
                                    )}
                                >
                                    <option value="">
                                        {loadingBuildings ? "Loading..." : "Select Building"}
                                    </option>
                                    {buildings.map(b => (
                                        <option key={b.id} value={b.id}>
                                            {formatName(b.name, b.type)}
                                        </option>
                                    ))}
                                </select>

                                {loadingBuildings && (
                                    <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {!selectedBuilding ? (
                    <div className="py-32 flex flex-col items-center text-center space-y-4">
                        <Building2 className="w-10 h-10 text-muted-foreground/50" />
                        <h3 className="text-xl font-black uppercase">
                            Initialise View
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Select a building to load data.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard 
                                title="Status"
                                value={selectedBuilding.status.replace("_", " ")}
                                icon={<div className={cn("w-2 h-2 rounded-full", statusColors.dot)} />}
                                color={statusColors.bg}
                            />

                            <StatCard 
                                title="Type"
                                value={formatType(selectedBuilding.name, selectedBuilding.type)}
                                icon={<Building2 className="w-5 h-5 text-primary" />}
                            />

                            <StatCard 
                                title="Address"
                                value={selectedBuilding.address}
                                isSmall
                                icon={<Clock className="w-5 h-5 text-muted-foreground" />}
                            />

                            <StatCard 
                                title="Tickets"
                                value={loadingTickets ? "..." : `${activeTickets} Active`}
                                icon={<AlertCircle className="w-5 h-5 text-destructive" />}
                                color="bg-destructive/10"
                            />
                        </div>

                        {/* Main */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            <Card className="lg:col-span-2 bg-primary text-primary-foreground border-none rounded-3xl">
                                <CardContent className="p-12 text-center">
                                    <Building2 className="w-12 h-12 text-primary-foreground/80 mx-auto mb-4" />
                                    <h4 className="text-2xl font-black">
                                        {formatName(selectedBuilding.name, selectedBuilding.type)}
                                    </h4>
                                    <Button variant="secondary" className="mt-6 font-bold">
                                        Enter 3D Viewer <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center font-black">
                                        <ClipboardCheck className="mr-2 w-5 h-5 text-primary" />
                                        Maintenance
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-6">
                                        {loadingTickets ? (
                                            <Loader2 className="animate-spin mx-auto text-muted-foreground" />
                                        ) : tickets.length === 0 ? (
                                            <p className="text-xs text-muted-foreground text-center">
                                                No tickets
                                            </p>
                                        ) : (
                                            tickets.slice(0, 4).map(t => (
                                                <TicketItem 
                                                    key={t.id}
                                                    title={t.issue}
                                                    time={`Logged ${t.time}`}
                                                    priority={t.priority}
                                                />
                                            ))
                                        )}
                                    </div>

                                    <Button 
                                        variant="outline"
                                        onClick={() => window.location.href = "/tickets"}
                                        className="w-full mt-8"
                                    >
                                        View All Tickets <ChevronRight className="ml-1 w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color = "bg-muted", isSmall = false }: any) {
    return (
        <Card className="rounded-2xl border-none shadow-sm bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                    <div className={cn("p-2 rounded-xl", color)}>
                        {icon}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase">
                        {title}
                    </p>
                </div>

                <p className={cn(
                    "font-black",
                    isSmall ? "text-sm" : "text-2xl"
                )}>
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}

function TicketItem({ title, time, priority }: any) {
    const dot =
        priority === "High"
            ? "bg-rose-500"
            : priority === "Med"
            ? "bg-amber-400"
            : "bg-blue-400";

    return (
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-bold">
                    {title}
                </p>
                <p className="text-xs text-muted-foreground">
                    {time}
                </p>
            </div>

            <div className={`w-2 h-2 rounded-full mt-1 ${dot}`} />
        </div>
    );
}