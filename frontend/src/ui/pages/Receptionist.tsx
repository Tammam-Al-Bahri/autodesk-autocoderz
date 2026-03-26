import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiFetch, apiUrl, cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  BedDouble, 
  Key, 
  Sparkles, 
  Wrench, 
  LogOut, 
  UserPlus, 
  ConciergeBell,
  Info
} from "lucide-react";

// colors for different room states (works in light and dark mode)
let statuses: any = {
  Clean: { color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-500/10 dark:border-emerald-500/30", icon: Sparkles },
  Dirty: { color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/30 dark:bg-rose-500/10 dark:border-rose-500/30", icon: BedDouble },
  Occupied: { color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/30 dark:bg-blue-500/10 dark:border-blue-500/30", icon: Key },
  Maintenance: { color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/30 dark:bg-amber-500/10 dark:border-amber-500/30", icon: Wrench },
};

export default function Receptionist() {
  let { buildingId } = useParams<any>();
  
  const [rooms, setRooms] = useState<any>([]);
  const [staff, setStaff] = useState<any>([]);
  const [activeRoomId, setActiveRoomId] = useState<any>(null);
  
  const [guestName, setGuestName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // grab the room we are currently looking at
  let currentRoom = rooms.find((r: any) => r.id === activeRoomId) || null;

  useEffect(() => {
    if (!buildingId) return;

    const loadStuff = async () => {
      try {
        setIsLoading(true);
        
        // fetch rooms
        let rRes = await apiFetch(apiUrl + "/rooms?buildingId=" + buildingId, { credentials: "include" });
        let rData = await rRes.json();
        
        if (rRes.ok) {
          setRooms(rData.data);
        }

        // fetch staff
        let sRes = await apiFetch(apiUrl + "/users/buildings/" + buildingId + "/staff", { credentials: "include" });
        let sData = await sRes.json();
        
        if (sRes.ok) {
          setStaff(sData.data);
        }
      } catch (err) {
        // console.log("error loading reception data", err);
        toast.error("Failed to synchronise building data");
      } 
      
      setIsLoading(false);
    };

    loadStuff();
  }, [buildingId]);

  const handleCheckIn = async () => {
    if (!currentRoom || guestName.trim() === "") {
      return toast.error("Guest name is required for check-in");
    }

    setIsLoading(true);
    let response = await apiFetch(apiUrl + "/bookings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName: guestName, roomId: currentRoom.id, buildingId: currentRoom.buildingId }),
    });

    let data = await response.json();
    if (response.ok) {
      // update UI
      setRooms((prev: any) => prev.map((r: any) => 
        r.id === currentRoom.id ? { ...r, status: "Occupied", guest: guestName, bookingId: data.data.id } : r
      ));
      setGuestName("");
      toast.success("Guest successfully checked in.");
    } else {
      toast.error("Booking could not be authorised.");
    }
    setIsLoading(false);
  };

  const handleCheckOut = async () => {
    if (!currentRoom) return;
    setIsLoading(true);
    
    // TODO: maybe add a confirmation modal here later?
    let res = await apiFetch(apiUrl + "/rooms/checkout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: currentRoom.id }),
    });

    if (res.ok) {
      setRooms((prev: any) => prev.map((r: any) => 
        r.id === currentRoom.id ? { ...r, status: "Dirty", guest: undefined, bookingId: undefined } : r
      ));
      toast.success("Guest checked out. Room flagged for cleaning.");
    }
    setIsLoading(false);
  };

  const assignTask = async (sId: string) => {
    let worker = staff.find((s: any) => s.id === sId);
    if (!currentRoom || !worker) return;

    setIsLoading(true);
    let res = await apiFetch(apiUrl + "/rooms/assign", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: currentRoom.id, staffId: worker.id, staffName: worker.name }),
    });

    if (res.ok) {
      setRooms((prev: any) => prev.map((r: any) => 
        r.id === currentRoom.id ? { ...r, status: "Maintenance", assignedToName: worker.name } : r
      ));
      toast.success("Room assigned to " + worker.name);
    }
    setIsLoading(false);
  };

  if (!buildingId) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground space-y-4">
        <ConciergeBell className="w-12 h-12 opacity-50 dark:opacity-40" />
        <p className="font-bold text-sm tracking-widest uppercase">No Property Selected</p>
      </div>
    );
  }

  let takenCount = rooms.filter((r: any) => r.status === "Occupied").length;
  let readyCount = rooms.filter((r: any) => r.status === "Clean").length;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-6 pb-24 text-foreground bg-background animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-border dark:border-border/50 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary dark:text-primary/80 mb-2">
            <ConciergeBell className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Front Desk Operations</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-foreground">Reception</h1>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-500/10 dark:bg-blue-900/20 border border-blue-500/20 dark:border-blue-800/30 px-4 py-2 rounded-xl text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 dark:text-blue-400">Occupied</p>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">{takenCount}</p>
          </div>
          <div className="bg-emerald-500/10 dark:bg-emerald-900/20 border border-emerald-500/20 dark:border-emerald-800/30 px-4 py-2 rounded-xl text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Ready</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{readyCount}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Room list */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {rooms.map((rm: any) => {
            let conf = statuses[rm.status];
            let Icon = conf.icon;
            let isSelected = rm.id === activeRoomId;
            
            return (
              <div
                key={rm.id}
                onClick={() => setActiveRoomId(rm.id)}
                className={cn(
                  "relative h-32 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2",
                  conf.bg,
                  isSelected ? "ring-4 ring-primary dark:ring-primary/80 ring-offset-4 ring-offset-background dark:ring-offset-zinc-950 scale-105 border-transparent shadow-lg" : "hover:scale-[1.02] hover:shadow-md"
                )}
              >
                <Icon className={cn("absolute top-3 right-3 w-4 h-4 opacity-50", conf.color)} />
                <span className={cn("text-3xl font-black tracking-tighter mb-1", conf.color)}>{rm.number}</span>
                <span className={cn("text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-background/50 dark:bg-zinc-900/80", conf.color)}>
                  {rm.status}
                </span>
                
                {rm.status === "Occupied" && (
                  <span className="absolute bottom-3 text-[10px] font-bold text-foreground bg-background/80 dark:bg-zinc-800/90 px-2.5 py-1 rounded-md truncate max-w-[85%] border border-border/50 dark:border-border/30 shadow-sm">
                    {rm.guest}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: details panel */}
        <div className="space-y-4 sticky top-6">
          {!currentRoom ? (
            <Card className="h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed border-2 dark:border-border/40 rounded-[2rem] bg-muted/10 dark:bg-muted/5">
              <Info className="w-10 h-10 mb-4 opacity-30 dark:opacity-20" />
              <p className="font-bold tracking-tight text-sm text-muted-foreground">Select a room to manage</p>
              <p className="text-[10px] uppercase tracking-widest mt-2 opacity-50">Awaiting selection</p>
            </Card>
          ) : (
            <Card className="border-none shadow-xl bg-card dark:bg-zinc-900/95 rounded-[2rem] overflow-hidden ring-1 ring-border/50 dark:ring-border/40">
              <div className={cn("h-2 w-full", statuses[currentRoom.status].bg.split(' ')[0].replace('/10', ''))} />
              
              <CardHeader className="border-b border-border/50 dark:border-border/40 pb-5 pt-6 px-8">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Selected Asset</p>
                    <CardTitle className="text-3xl font-black text-foreground">Room {currentRoom.number}</CardTitle>
                  </div>
                  <Badge className={cn("uppercase text-[10px] font-black px-3 py-1.5 border-none", statuses[currentRoom.status].bg, statuses[currentRoom.status].color)}>
                    {currentRoom.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                
                {/* Clean room actions */}
                {currentRoom.status === "Clean" && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Guest Registry</label>
                      <Input 
                        value={guestName} 
                        onChange={(e) => setGuestName(e.target.value)} 
                        placeholder="Enter guest's full name..." 
                        className="h-12 rounded-xl bg-muted/50 dark:bg-zinc-800/50 border-border/80 dark:border-border/50 text-foreground text-sm font-bold focus-visible:ring-primary/30 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    <Button onClick={handleCheckIn} disabled={isLoading} className="w-full h-12 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20 dark:shadow-primary/10 hover:scale-[1.02] transition-transform">
                      <UserPlus className="w-4 h-4 mr-2" /> Authorise Check-In
                    </Button>
                  </div>
                )}

                {/* Occupied room actions */}
                {currentRoom.status === "Occupied" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-5 bg-blue-500/10 dark:bg-blue-900/10 border border-blue-500/20 dark:border-blue-800/30 rounded-2xl">
                      <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Current Guest</p>
                      <p className="text-xl font-black text-foreground mb-4">{currentRoom.guest}</p>
                      
                      {currentRoom.bookingId && (
                        <div className="bg-background/80 dark:bg-zinc-800/80 p-3 rounded-xl border border-border/50 dark:border-border/50 flex justify-between items-center">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Booking Ref</p>
                          <p className="font-mono font-black text-blue-600 dark:text-blue-400 tracking-wider">
                            {currentRoom.bookingId.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button onClick={handleCheckOut} disabled={isLoading} variant="destructive" className="w-full h-12 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-rose-500/20 dark:shadow-rose-900/20 hover:scale-[1.02] transition-transform">
                      <LogOut className="w-4 h-4 mr-2" /> Process Check-Out
                    </Button>
                  </div>
                )}

                {/* Dirty room actions */}
                {currentRoom.status === "Dirty" && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-5 bg-rose-500/10 dark:bg-rose-900/10 border border-rose-500/20 dark:border-rose-800/30 rounded-2xl text-center mb-2">
                      <BedDouble className="w-8 h-8 text-rose-500 dark:text-rose-400 mx-auto mb-2 opacity-80" />
                      <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Room Requires Cleaning</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Dispatch Staff</label>
                      <select 
                        className="w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-zinc-800/50 text-foreground text-sm font-bold border border-border/80 dark:border-border/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                        onChange={(e) => assignTask(e.target.value)}
                        value=""
                        disabled={isLoading}
                      >
                        <option value="" disabled>Select Staff Member...</option>
                        {staff.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Maintenance room actions */}
                {currentRoom.status === "Maintenance" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-5 bg-amber-500/10 dark:bg-amber-900/10 border border-amber-500/20 dark:border-amber-800/30 rounded-2xl flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20 dark:bg-amber-500/10 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-0.5">Active Assignment</p>
                        <p className="text-lg font-black text-foreground">{currentRoom.assignedToName}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t border-border/50 dark:border-border/40">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Reassign Task</label>
                      <select 
                        className="w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-zinc-800/50 text-foreground text-sm font-bold border border-border/80 dark:border-border/50 outline-none focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer"
                        onChange={(e) => assignTask(e.target.value)}
                        value=""
                        disabled={isLoading}
                      >
                        <option value="" disabled>Select Alternate Staff...</option>
                        {staff
                          .filter((s: any) => s.name !== currentRoom.assignedToName)
                          .map((s: any) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}