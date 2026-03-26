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
import { buildingsBase, buildingGroupsBase, ticketsBase } from "@autocoderz/shared";
import { toast } from "sonner";

// formatting helpers
let formatName = (name: any, type: any) => {
  if (type === "OTHER" && name.includes(" - ")) {
    let split = name.split(" - ");
    split.pop();
    return split.join(" - ");
  }
  return name;
};

let formatType = (name: any, type: any) => {
  if (type === "OTHER" && name.includes(" - ")) {
    return name.split(" - ").pop();
  }
  return type ? type.replace(/_/g, " ") : "Unknown";
};

let getStatusStyle = (status: any) => {
  if (status === "ACTIVE") return { dot: "bg-green-500 dark:bg-green-400", bg: "bg-green-500/10 dark:bg-green-500/5" };
  if (status === "INACTIVE") return { dot: "bg-red-500 dark:bg-red-400", bg: "bg-red-500/10 dark:bg-red-500/5" };
  if (status === "DRAFT") return { dot: "bg-orange-500 dark:bg-orange-400", bg: "bg-orange-500/10 dark:bg-orange-500/5" };
  return { dot: "bg-muted-foreground dark:bg-zinc-500", bg: "bg-muted dark:bg-zinc-800/50" };
};

export default function Dashboard() {
  const [comps, setComps] = useState<any>([]);
  const [builds, setBuilds] = useState<any>([]);
  const [tix, setTix] = useState<any>([]);
  
  const [cId, setCId] = useState("");
  const [bId, setBId] = useState("");
  
  const [loadingC, setLoadingC] = useState(true);
  const [loadingB, setLoadingB] = useState(false);
  const [loadingT, setLoadingT] = useState(false);

  // load portfolio groups on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        let res = await apiFetch(apiUrl + buildingGroupsBase);
        let json = await res.json();
        
        if (res.ok) {
          setComps(json.data || []);
        } else {
          toast.error("Failed to load portfolio groups");
        }
      } catch (err) {
        // console.log("company load error", err);
      }
      setLoadingC(false);
    };
    
    fetchCompanies();
  }, []);

  // load buildings when company changes
  useEffect(() => {
    if (!cId) {
      setBuilds([]);
      setBId("");
      return;
    }

    const fetchBuildings = async () => {
      setLoadingB(true);
      try {
        let res = await apiFetch(apiUrl + buildingsBase + "?buildingGroupId=" + cId);
        let json = await res.json();
        if (res.ok) {
          setBuilds(json.data || []);
        }
      } catch (err) {
        toast.error("Error loading buildings");
      }
      setLoadingB(false);
    };
    
    fetchBuildings();
  }, [cId]);

  // load tickets when building changes
  useEffect(() => {
    if (!bId) {
      setTix([]);
      return;
    }

    const fetchTickets = async () => {
      setLoadingT(true);
      try {
        let res = await apiFetch(apiUrl + ticketsBase + "?buildingId=" + bId);
        let json = await res.json();
        if (res.ok) {
          setTix(json.data || []);
        }
      } catch (err) {
        // console.log("ticket error", err);
      }
      setLoadingT(false);
    };
    
    fetchTickets();
  }, [bId]);

  let currentBuilding = builds.find((b: any) => b.id === bId);
  let statusColors = getStatusStyle(currentBuilding?.status || "");
  let openTixCount = tix.filter((t: any) => t.status === "Open").length;

  return (
    <div className="min-h-screen bg-background pb-16">
      
      {/* Top sticky header */}
      <div className="bg-background border-b border-border/60 dark:border-border/40 mb-8 pt-8 pb-6 px-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-foreground">
              <LayoutDashboard className="text-primary dark:text-primary/90 w-8 h-8" />
              Manager Dashboard
            </h1>
            <p className="text-muted-foreground font-medium">
              Real-time property asset management.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Company Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">
                Company
              </label>
              <div className="relative">
                <select
                  value={cId}
                  onChange={(e) => setCId(e.target.value)}
                  disabled={loadingC}
                  className="bg-muted dark:bg-zinc-900/80 border border-transparent dark:border-border/40 text-foreground h-11 px-4 pr-10 rounded-xl font-bold min-w-[200px] outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
                >
                  <option value="">
                    {loadingC ? "Loading..." : "Select Portfolio"}
                  </option>
                  {comps.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {loadingC && (
                  <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Building Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">
                Building
              </label>
              <div className="relative">
                <select
                  value={bId}
                  disabled={!cId || loadingB}
                  onChange={(e) => setBId(e.target.value)}
                  className={cn(
                    "h-11 px-4 pr-10 rounded-xl font-bold min-w-[200px] border outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none",
                    !cId 
                      ? "bg-muted/50 dark:bg-zinc-900/30 text-muted-foreground border-transparent dark:border-border/20" 
                      : "bg-muted dark:bg-zinc-900/80 text-foreground border-transparent dark:border-border/40"
                  )}
                >
                  <option value="">
                    {loadingB ? "Loading..." : "Select Building"}
                  </option>
                  {builds.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {formatName(b.name, b.type)}
                    </option>
                  ))}
                </select>

                {loadingB && (
                  <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {!currentBuilding ? (
          <div className="py-32 flex flex-col items-center text-center space-y-4">
            <Building2 className="w-10 h-10 text-muted-foreground/50 dark:text-muted-foreground/30" />
            <h3 className="text-xl font-black uppercase text-foreground">
              Initialise View
            </h3>
            <p className="text-sm text-muted-foreground">
              Select a building to load data.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard 
                title="Status"
                value={currentBuilding.status.replace("_", " ")}
                icon={<div className={cn("w-2 h-2 rounded-full", statusColors.dot)} />}
                color={statusColors.bg}
              />

              <StatCard 
                title="Type"
                value={formatType(currentBuilding.name, currentBuilding.type)}
                icon={<Building2 className="w-5 h-5 text-primary dark:text-primary/80" />}
              />

              <StatCard 
                title="Address"
                value={currentBuilding.address}
                isSmall
                icon={<Clock className="w-5 h-5 text-muted-foreground" />}
              />

              <StatCard 
                title="Tickets"
                value={loadingT ? "..." : `${openTixCount} Active`}
                icon={<AlertCircle className="w-5 h-5 text-destructive dark:text-rose-400" />}
                color="bg-destructive/10 dark:bg-rose-900/20"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-primary dark:bg-primary/90 text-primary-foreground border-none rounded-3xl shadow-md">
                <CardContent className="p-12 text-center">
                  <Building2 className="w-12 h-12 text-primary-foreground/80 mx-auto mb-4" />
                  <h4 className="text-2xl font-black">
                    {formatName(currentBuilding.name, currentBuilding.type)}
                  </h4>
                  <Button variant="secondary" className="mt-6 font-bold shadow-sm">
                    Enter 3D Viewer <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/60 dark:border-border/40 shadow-sm bg-card dark:bg-zinc-900/95">
                <CardHeader>
                  <CardTitle className="flex items-center font-black text-foreground">
                    <ClipboardCheck className="mr-2 w-5 h-5 text-primary dark:text-primary/90" />
                    Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {loadingT ? (
                      <Loader2 className="animate-spin mx-auto text-muted-foreground" />
                    ) : tix.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center">No tickets</p>
                    ) : (
                      tix.slice(0, 4).map((t: any) => (
                        <TicketItem key={t.id} title={t.issue} time={`Logged ${t.time}`} priority={t.priority} />
                      ))
                    )}
                  </div>
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = "/tickets"}
                    className="w-full mt-8 border-border/60 dark:border-border/50 dark:hover:bg-zinc-800"
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

// Subcomponents
function StatCard({ title, value, icon, color = "bg-muted dark:bg-zinc-800/50", isSmall = false }: any) {
  return (
    <Card className="rounded-2xl border border-border/50 dark:border-border/30 shadow-sm bg-card dark:bg-zinc-900/95">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div className={cn("p-2 rounded-xl", color)}>{icon}</div>
          <p className="text-[10px] text-muted-foreground uppercase">{title}</p>
        </div>
        <p className={cn("font-black text-foreground", isSmall ? "text-sm" : "text-2xl")}>{value}</p>
      </CardContent>
    </Card>
  );
}

function TicketItem({ title, time, priority }: any) {
  let dot = priority === "High" ? "bg-rose-500 dark:bg-rose-400" : priority === "Med" ? "bg-amber-400 dark:bg-amber-500" : "bg-blue-400 dark:bg-blue-500";
  
  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <div className={`w-2 h-2 rounded-full mt-1 ${dot}`} />
    </div>
  );
}