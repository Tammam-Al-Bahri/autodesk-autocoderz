import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, AlertCircle, RefreshCcw, Building2, CheckCircle2, Home, Send, Filter, Activity, ClipboardCheck, ChevronRight } from "lucide-react";
import { ticketsBase, buildingsBase, buildingGroupsBase } from "@autocoderz/shared";
import { apiUrl, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Tickets() {

    const [ticketData, setTicketData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    const [companyList, setCompanyList] = useState<any[]>([]);
    const [buildingList, setBuildingList] = useState<any[]>([]);
    const [roomList, setRoomList] = useState<any[]>([]);

    const [formOpen, setFormOpen] = useState(false);
    const [chosenCompany, setChosenCompany] = useState("");
    const [chosenBuilding, setChosenBuilding] = useState("");
    const [chosenRoom, setChosenRoom] = useState("");
    const [issueDesc, setIssueDesc] = useState("");
    const [ticketPriority, setTicketPriority] = useState("LOW");
    const [isSending, setIsSending] = useState(false);

    const loadTickets = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}${ticketsBase}`, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setTicketData(data.data || []);

            const res2 = await fetch(`${apiUrl}${buildingGroupsBase}`, { credentials: "include" });
            const data2 = await res2.json();
            if (res2.ok) setCompanyList(data2.data || []);
        } catch(e) {
            toast.error("Couldn't load tickets");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        if (!chosenCompany) {
            setBuildingList([]);
            setChosenBuilding("");
            return;
        }

        const getBuildings = async () => {
            const res = await fetch(`${apiUrl}${buildingsBase}?buildingGroupId=${chosenCompany}`, { credentials: "include" });
            const json = await res.json();
            setBuildingList(json.data || []);
        };

        getBuildings();
        setChosenBuilding("");
        setRoomList([]);
    }, [chosenCompany]);

    useEffect(() => {
        if (!chosenBuilding) {
            setRoomList([]);
            setChosenRoom("");
            return;
        }

        const getRooms = async () => {
            const res = await fetch(`${apiUrl}/rooms?buildingId=${chosenBuilding}`, { credentials: "include" });
            const json = await res.json();
            setRoomList(json.data || []);
        };

        getRooms();
        setChosenRoom("");
    }, [chosenBuilding]);

    const shownTickets = activeFilter === "All" ? ticketData : ticketData.filter(t => t.status === activeFilter);
    const numOpen = ticketData.filter(t => t.status === "Open").length;

    const submitTicket = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!issueDesc.trim() || !chosenBuilding) {
            toast.error("Please fill in building and issue");
            return;
        }

        setIsSending(true);

        try {
            const res = await fetch(`${apiUrl}${ticketsBase}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    buildingId: chosenBuilding,
                    roomId: chosenRoom || null,
                    issue: issueDesc,
                    priority: ticketPriority
                })
            });

            if (res.ok) {
                toast.success("Ticket submitted!");
                setIssueDesc("");
                setFormOpen(false);
                loadTickets();
            } else if (res.status === 401) {
                toast.error("Not logged in");
            }
        } catch(e) {
            toast.error("Submit failed");
        }

        setIsSending(false);
    };

    const markResolved = async (id: string) => {
        try {
            const res = await fetch(`${apiUrl}${ticketsBase}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id, status: "Resolved" })
            });

            if (res.ok) {
                setTicketData(prev => prev.map(t => t.id === id ? {...t, status: "Resolved"} : t));
                toast.success("Marked as resolved");
            }
        } catch(e) {
            console.log("resolve failed", e);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 px-6 pb-24 text-foreground">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
                <div>
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <Activity className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Live Feed</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Maintenance</h1>
                    <p className="text-muted-foreground text-sm italic mt-1">Fiktional Estates Group Central Registry.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">Current Backlog</span>
                        <span className="text-2xl font-black text-rose-500">{numOpen} Issues</span>
                    </div>
                    <Button variant="outline" size="icon"
                        onClick={loadTickets}
                        className={cn("rounded-xl border-2 h-12 w-12", isLoading && "animate-spin")}>
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                    <Button onClick={() => setFormOpen(!formOpen)} className="h-12 px-6 rounded-xl font-black uppercase text-[11px] tracking-widest">
                        {formOpen
                            ? <><X className="mr-2 w-4 h-4" />Close</>
                            : <><Plus className="mr-2 w-4 h-4" />Raise Ticket</>}
                    </Button>
                </div>
            </div>

            {formOpen && (
                <Card className="mb-10 border-none bg-card shadow-lg ring-1 ring-border">
                    <div className="bg-primary h-1 w-full opacity-40" />
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="w-4 h-4" /> Dispatch Repair Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitTicket} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block mb-1.5">Portfolio Group</label>
                                    <select
                                        value={chosenCompany}
                                        onChange={e => setChosenCompany(e.target.value)}
                                        className="w-full h-11 px-3 rounded-xl bg-muted text-foreground text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer">
                                        <option value="">Select Company...</option>
                                        {companyList.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block mb-1.5">Managed Asset</label>
                                    <select
                                        value={chosenBuilding}
                                        onChange={e => setChosenBuilding(e.target.value)}
                                        disabled={!chosenCompany}
                                        className="w-full h-11 px-3 rounded-xl bg-muted text-foreground text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-40 appearance-none">
                                        <option value="">Select Building...</option>
                                        {buildingList.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block mb-1.5">Internal Location</label>
                                    <select
                                        value={chosenRoom}
                                        onChange={e => setChosenRoom(e.target.value)}
                                        disabled={!chosenBuilding}
                                        className="w-full h-11 px-3 rounded-xl bg-muted text-foreground text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-40 appearance-none">
                                        <option value="">General / Room...</option>
                                        {roomList.map(r => (
                                            <option key={r.id} value={r.id}>Room {r.number}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block mb-1.5">Technical Fault Description</label>
                                <Textarea
                                    placeholder="Describe the issue..."
                                    value={issueDesc}
                                    onChange={e => setIssueDesc(e.target.value)}
                                    className="bg-muted border-none text-foreground min-h-[110px] rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center pt-4 border-t border-border">
                                <div className="flex items-center gap-3 flex-1 w-full">
                                    <span className="text-[9px] font-black uppercase text-muted-foreground">Urgency:</span>
                                    <select
                                        value={ticketPriority}
                                        onChange={e => setTicketPriority(e.target.value)}
                                        className="h-10 px-3 rounded-lg bg-muted text-foreground text-[10px] font-black uppercase border-none outline-none ring-1 ring-border">
                                        <option value="LOW">Low Priority</option>
                                        <option value="MED">Medium</option>
                                        <option value="HIGH">High Priority</option>
                                    </select>
                                </div>
                                <Button type="submit" disabled={isSending} className="w-full sm:w-auto h-11 px-8 font-black uppercase text-[10px] tracking-widest rounded-xl">
                                    {isSending ? "Sending..." : <><Send className="w-3 h-3 mr-2" />Submit Ticket</>}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1 bg-muted/60 p-1 rounded-xl border border-border">
                    {["All", "Open", "Resolved"].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={cn(
                                "px-5 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                                activeFilter === f
                                    ? "bg-background text-primary shadow-sm ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground"
                            )}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground opacity-50">
                    <Filter className="w-3 h-3" /> Filters Used
                </div>
            </div>

            <div className="grid gap-5">
                {shownTickets.length === 0 ? (
                    <div className="py-28 text-center border-2 border-dashed border-border rounded-3xl">
                        <ClipboardCheck className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-muted-foreground font-semibold text-sm">No tickets here.</p>
                    </div>
                ) : (
                    [...shownTickets].reverse().map(t => (
                        <Card key={t.id} className="border-none bg-card shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50 rounded-2xl overflow-hidden">
                            <div className={cn("h-1.5 w-full", t.status === "Open" ? "bg-rose-500" : "bg-emerald-500")} />
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-5">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full border border-border">
                                                <Building2 className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-bold text-foreground">{t.hotel}</span>
                                            </div>
                                            <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                            <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full border border-border">
                                                <Home className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-bold text-foreground">{t.room}</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Ref: {t.id.slice(-8)}</p>
                                    </div>
                                    <Badge
                                        variant={t.status === "Open" ? "destructive" : "secondary"}
                                        className="uppercase text-[9px] font-black px-3 py-1 rounded-full">
                                        {t.status}
                                    </Badge>
                                </div>

                                <div className="bg-muted/40 p-5 rounded-xl border border-border/40 mb-5">
                                    <p className="text-sm text-foreground/80 leading-relaxed italic">"{t.issue}"</p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-border/30">
                                    <div className="flex gap-5 items-center w-full sm:w-auto justify-between sm:justify-start">
                                        <div>
                                            <p className="text-[8px] font-black text-muted-foreground uppercase mb-0.5">Time Logged</p>
                                            <p className="text-[11px] font-bold text-foreground">{t.time}</p>
                                        </div>
                                        <span className={cn(
                                            "text-[9px] px-2.5 py-1 rounded-lg font-black uppercase border",
                                            t.priority === "High" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                            t.priority === "Med" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                            "bg-sky-500/10 text-sky-500 border-sky-500/20"
                                        )}>
                                            {t.priority} Priority
                                        </span>
                                    </div>
                                    {t.status === "Open" && (
                                        <Button
                                            onClick={() => markResolved(t.id)}
                                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase h-10 px-6 rounded-xl">
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Resolved
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}