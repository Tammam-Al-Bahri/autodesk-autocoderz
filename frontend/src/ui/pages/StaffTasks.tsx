import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch, apiUrl, cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  ClipboardList, 
  History, 
  CheckCircle2, 
  Clock, 
  User, 
  AlertTriangle,
} from "lucide-react";

export default function StaffTasks() {
  const [tasks, setTasks] = useState<any>([]);
  const [historyLogs, setHistoryLogs] = useState<any>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // notes for each room
  const [notes, setNotes] = useState<any>({});
  const [currentView, setCurrentView] = useState("pending"); // pending or history

  const fetchEverything = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      // get current logged in user
      let uRes = await apiFetch(apiUrl + `/users/me?_t=${Date.now()}`, { credentials: "include" });
      if (!uRes.ok) return;
      
      let uData = await uRes.json();
      setUser(uData.data);

      // get rooms and filter for my tasks
      let rRes = await apiFetch(apiUrl + `/rooms?_t=${Date.now()}`, { credentials: "include" });
      let rData = await rRes.json();
      if (rRes.ok) {
        let mine = rData.data.filter((r: any) => r.assignedToId === uData.data.id);
        setTasks(mine);
      }

      // get past tasks
      let hRes = await apiFetch(apiUrl + `/users/me/task-history?_t=${Date.now()}`, { credentials: "include" });
      let hData = await hRes.json();
      if (hRes.ok) {
        setHistoryLogs(hData.data);
      }
    } catch (err) {
      console.log("error fetching data", err);
    } 
    
    if (showLoading) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEverything(true);
  }, []);

  const handleDone = async (t: any) => {
    let msg = notes[t.id] || "";
    // console.log("completing task", t.id, msg);
    
    try {
      const res = await apiFetch(`${apiUrl}/rooms/clean`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: t.id, message: msg }),
      });

      if (res.ok) {
        toast.success("Task completed and synchronised!");
        setNotes({...notes, [t.id]: ""}); // clear the input
        fetchEverything(false); // reload but don't show spinner
      }
    } catch (e) {
      toast.error("Failed to save completion");
    }
  }

  function calcTime(start: any, end: any) {
    let s = new Date(start).getTime();
    let e = new Date(end).getTime();
    let diffInMins = Math.round((e - s) / 60000);
    
    if (diffInMins > 0) {
      return diffInMins + " mins";
    }
    return "< 1 min";
  }

  const prettyTime = (d: any) => {
    return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // show loading screen if we dont have user yet
  if (isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground animate-pulse space-y-4">
        <ClipboardList className="w-10 h-10 opacity-50 dark:opacity-40" />
        <p className="font-bold text-sm tracking-widest uppercase text-muted-foreground">Synchronising Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 px-4 pb-20 bg-background text-foreground animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="mb-8 bg-card dark:bg-card/95 border border-border/50 dark:border-border/30 p-5 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">My Tasks</h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1.5">
            <User className="w-3 h-3" /> {user?.firstName} {user?.lastName}
          </p>
        </div>
        <div className="h-12 w-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center border border-primary/20 dark:border-primary/30">
            <ClipboardList className="w-6 h-6 text-primary dark:text-primary/90" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted/50 dark:bg-muted/20 p-1.5 rounded-2xl border border-border/50 dark:border-border/20">
        <button 
          onClick={() => setCurrentView("pending")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
            currentView === "pending" 
              ? "bg-background dark:bg-zinc-800/80 shadow-sm text-foreground ring-1 ring-border/50 dark:ring-border/40" 
              : "text-muted-foreground hover:text-foreground dark:hover:text-zinc-300"
          )}
        >
          <ClipboardList className="w-3.5 h-3.5" /> 
          Active ({tasks.length})
        </button>
        <button 
          onClick={() => setCurrentView("history")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
            currentView === "history" 
              ? "bg-background dark:bg-zinc-800/80 shadow-sm text-foreground ring-1 ring-border/50 dark:ring-border/40" 
              : "text-muted-foreground hover:text-foreground dark:hover:text-zinc-300"
          )}
        >
          <History className="w-3.5 h-3.5" /> 
          Archive
        </button>
      </div>

      <div className="space-y-4">
        {currentView === "pending" ? (
          tasks.length === 0 ? (
            <div className="text-center p-14 border-2 border-dashed border-border/60 dark:border-border/30 rounded-[2rem] bg-muted/10 dark:bg-muted/5">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/50 dark:text-emerald-500/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-bold tracking-tight text-sm">You are all caught up.</p>
            </div>
          ) : (
            tasks.map((t: any) => (
              <Card key={t.id} className="border-none shadow-md bg-card dark:bg-card/95 overflow-hidden ring-1 ring-border/50 dark:ring-border/30 rounded-3xl group">
                <div className="h-1.5 w-full bg-rose-500 dark:bg-rose-600" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <span className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-1 block">Location</span>
                      <span className="text-3xl font-black leading-none block text-foreground">Room {t.number}</span>
                    </div>
                    <Badge variant="destructive" className="uppercase text-[9px] font-black tracking-widest px-3 py-1 flex items-center gap-1 shadow-sm dark:bg-red-900 dark:text-red-100">
                      <AlertTriangle className="w-3 h-3" /> Urgent
                    </Badge>
                  </div>

                  <div className="bg-muted/30 dark:bg-muted/10 p-3 rounded-xl border border-border/50 dark:border-border/30 mb-5 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <p className="text-xs font-bold text-foreground/80 dark:text-zinc-300">
                      Assigned by: <span className="text-foreground dark:text-zinc-100">{t.assignedByName}</span>
                    </p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-border/50 dark:border-border/30">
                    <input 
                      type="text"
                      placeholder="Add completion notes..."
                      className="w-full text-sm px-4 py-3 h-12 bg-muted/50 dark:bg-zinc-900/50 border border-border/50 dark:border-border/30 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/50 transition-all"
                      value={notes[t.id] || ""}
                      onChange={(e) => setNotes({...notes, [t.id]: e.target.value})}
                    />
                    <Button
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600/90 dark:hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 hover:scale-[1.02] transition-transform"
                      onClick={() => handleDone(t)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Done
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )
        ) : (
          historyLogs.length === 0 ? (
            <div className="text-center p-14 border-2 border-dashed border-border/60 dark:border-border/30 rounded-[2rem] bg-muted/10 dark:bg-muted/5">
              <History className="w-10 h-10 text-muted-foreground/30 dark:text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground font-bold tracking-tight text-sm">No archived history found.</p>
            </div>
          ) : (
            historyLogs.map((item: any) => (
              <Card key={item.id} className="border border-border/50 dark:border-border/30 shadow-sm bg-card/50 dark:bg-card/40 rounded-[2rem]">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-black text-foreground">Room {item.roomNumber}</span>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-emerald-500 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/5 px-3 py-1">
                      {calcTime(item.assignedAt, item.completedAt)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-muted/30 dark:bg-muted/10 rounded-2xl border border-border/50 dark:border-border/30 flex flex-col items-center text-center">
                      <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Started</p>
                      <p className="text-sm font-black text-foreground flex items-center gap-1.5"><Clock className="w-3 h-3 text-primary" />{prettyTime(item.assignedAt)}</p>
                    </div>
                    <div className="p-3 bg-muted/30 dark:bg-muted/10 rounded-2xl border border-border/50 dark:border-border/30 flex flex-col items-center text-center">
                      <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Finished</p>
                      <p className="text-sm font-black text-foreground flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />{prettyTime(item.completedAt)}</p>
                    </div>
                  </div>

                  {item.message && (
                    <div className="bg-background dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-border/80 dark:border-border/40 relative mt-2">
                       <span className="absolute -top-2 left-3 bg-background dark:bg-zinc-900 px-1 text-[8px] font-black uppercase tracking-widest text-muted-foreground">Notes</span>
                      <p className="text-xs font-medium text-foreground/90 dark:text-zinc-300 italic pt-1">
                        "{item.message}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )
        )}
      </div>
    </div>
  );
}