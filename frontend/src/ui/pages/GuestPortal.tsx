import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AutodeskViewer from "@/components/AutodeskViewer";
import { apiFetch, apiUrl } from "@/lib/utils";
import { apsBase, apsRoutes } from "@autocoderz/shared";
import { toast } from "sonner";
import {
    Bed,
    Wind,
    Tv,
    Shield,
    Refrigerator,
    Utensils,
    Sparkles,
    LogOut,
    KeyRound,
    Info,
    ChevronRight,
    CheckCircle2,
    Lock
} from "lucide-react";

const SNOWDON_URN = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXV0b2NvZGVyel9wZXJtYW5lbnRfc3RvcmFnZS9Tbm93ZG9uX1Rvd2Vyc19GaW5hbC5ydnQ";

export default function GuestPortal() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [booking, setBooking] = useState("");
    const [token, setToken] = useState("");

    const [requestTimes, setRequestTimes] = useState<any>({});
    const [requests, setRequests] = useState<any[]>([]);
    const [now, setNow] = useState(Date.now());

    const roomNumber = "204";
    const COOLDOWN = 2 * 60 * 60 * 1000;

    useEffect(() => {
        apiFetch(`${apiUrl}${apsBase}${apsRoutes.viewerToken}`)
            .then((res) => res.json())
            .then((data) => {
                setToken(data.access_token);
            })
            .catch((e) => {
                console.log("error getting token", e);
            });
    }, []);

    useEffect(() => {
        const t = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(t);
    }, []);

    function login() {
        if (booking && booking.length > 3) {
            setLoggedIn(true);
        } else {
            toast.error("Invalid Booking ID", {
                description: "Please enter a valid booking reference."
            });
        }
    }

    function handleAction(name: string) {
        const time = Date.now();
        const last = requestTimes[name] || 0;

        if (time - last < COOLDOWN) return;

        setRequestTimes((prev: any) => ({
            ...prev,
            [name]: time
        }));

        const newItem = {
            id: time,
            action: name,
            time: time
        };

        setRequests((prev) => [newItem, ...prev]);

        toast.success("Request Dispatched", {
            description: `Your request for ${name} has been sent to the receptionist.`,
            icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
        });
    }

    function getCooldown(name: string) {
        const last = requestTimes[name] || 0;
        const diff = now - last;

        if (diff < COOLDOWN) {
            const left = COOLDOWN - diff;

            const h = Math.floor(left / 3600000);
            const m = Math.floor((left % 3600000) / 60000);
            const s = Math.floor((left % 60000) / 1000);

            const pad = (n: number) => n.toString().padStart(2, "0");

            return {
                isDisabled: true,
                text: `${pad(h)}:${pad(m)}:${pad(s)}`
            };
        }

        return { isDisabled: false, text: "" };
    }

    if (!loggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb')] bg-cover bg-center">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

                <Card className="w-full max-w-md relative bg-card/95 backdrop-blur-md border-border shadow-2xl">
                    <CardHeader className="pt-8">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <KeyRound className="text-primary w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-black text-center text-foreground">
                            Guest Access
                        </CardTitle>
                        <p className="text-center text-muted-foreground text-sm">
                            Enter your booking reference to access your room details.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4 pb-10">
                        <Input
                            placeholder="e.g. BKG-1234"
                            value={booking}
                            className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground"
                            onChange={(e) => setBooking(e.target.value)}
                        />
                        <Button
                            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                            onClick={login}
                        >
                            Access Booking
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/20 text-primary border-none animate-pulse">
                                ACTIVE SESSION
                            </Badge>
                            <h1 className="text-2xl font-black text-foreground">
                                Suite {roomNumber}
                            </h1>
                        </div>
                        <p className="text-xs text-muted-foreground uppercase mt-1 tracking-wider">
                            Snowdon Towers
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => setLoggedIn(false)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="w-5 h-5 md:mr-2" />
                        <span className="hidden md:inline">Exit Guest Mode</span>
                    </Button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border shadow-xl bg-muted/20 overflow-hidden min-h-[500px]">
                        <CardContent className="p-0 h-full">
                            {token ? (
                                <AutodeskViewer urn={SNOWDON_URN} token={token} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-40">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    <p className="text-xs uppercase font-mono tracking-widest">
                                        Loading building model...
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Amenity icon={<Bed className="w-5 h-5" />} label="King Bed" />
                        <Amenity icon={<Refrigerator className="w-5 h-5" />} label="Mini Bar" />
                        <Amenity icon={<Shield className="w-5 h-5" />} label="Safe" />
                        <Amenity icon={<Tv className="w-5 h-5" />} label="Smart TV" />
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-lg border-border bg-primary/5 text-foreground">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg font-bold">
                                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                                Concierge
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ServiceButton icon={<Utensils className="w-4 h-4" />} label="Room Service" onClick={() => handleAction("Room Service")} cooldown={getCooldown("Room Service")} />
                            <ServiceButton icon={<Info className="w-4 h-4" />} label="Hotel Info" onClick={() => handleAction("Hotel Info")} cooldown={getCooldown("Hotel Info")} />
                            <ServiceButton icon={<Wind className="w-4 h-4" />} label="Climate Control" onClick={() => handleAction("Climate Control")} cooldown={getCooldown("Climate Control")} />
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-foreground">
                                Quick Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <RequestButton icon={<Sparkles className="w-4 h-4" />} label="Extra Towels" onClick={() => handleAction("Extra Towels")} cooldown={getCooldown("Extra Towels")} />
                            <RequestButton icon={<Utensils className="w-4 h-4" />} label="Fresh Linens" onClick={() => handleAction("Fresh Linens")} cooldown={getCooldown("Fresh Linens")} />
                            <RequestButton icon={<Wind className="w-4 h-4" />} label="Maintenance" onClick={() => handleAction("Maintenance Report")} cooldown={getCooldown("Maintenance Report")} />
                        </CardContent>
                    </Card>

                    {requests.length > 0 && (
                        <Card className="shadow-lg border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-foreground">
                                    Active Requests
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {requests.map((r) => {
                                    const diff = now - r.time;
                                    const left = Math.max(0, COOLDOWN - diff);
                                    const done = left === 0;
                                    const percent = Math.min(100, (diff / COOLDOWN) * 100);

                                    return (
                                        <div key={r.id} className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-foreground">{r.action}</span>
                                                <Badge variant="outline" className={done ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"}>
                                                    {done ? "Completed" : "Pending"}
                                                </Badge>
                                            </div>
                                            {!done && (
                                                <Progress value={percent} className="h-1.5 w-full bg-muted" />
                                            )}
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}


function Amenity({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <Card className="bg-card border-border shadow-sm transition-colors hover:bg-muted/50 cursor-default">
            <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="text-muted-foreground mb-2">{icon}</div>
                <p className="text-xs font-bold text-foreground">{label}</p>
            </CardContent>
        </Card>
    );
}

function ServiceButton(props: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    cooldown: { isDisabled: boolean; text: string };
}) {
    return (
        <button
            onClick={props.onClick}
            disabled={props.cooldown.isDisabled}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                props.cooldown.isDisabled
                    ? "bg-muted/30 border-border opacity-60 cursor-not-allowed"
                    : "bg-background border-border hover:border-primary/50 hover:bg-muted/50 text-foreground"
            }`}
        >
            <div className="flex items-center">
                <span className={`mr-3 ${props.cooldown.isDisabled ? "text-muted-foreground" : "text-primary"}`}>
                    {props.icon}
                </span>
                <span className={`font-semibold text-sm ${props.cooldown.isDisabled ? "text-muted-foreground" : ""}`}>
                    {props.label}
                </span>
            </div>

            {props.cooldown.isDisabled ? (
                <div className="flex items-center gap-1.5 text-orange-500">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs font-mono">{props.cooldown.text}</span>
                </div>
            ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
        </button>
    );
}

function RequestButton(props: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    cooldown: { isDisabled: boolean; text: string };
}) {
    return (
        <Button
            variant="outline"
            onClick={props.onClick}
            disabled={props.cooldown.isDisabled}
            className={`justify-between w-full border-border ${
                props.cooldown.isDisabled
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-muted/50 text-foreground"
            }`}
        >
            <span className="flex items-center">
                <span className={`mr-2 ${props.cooldown.isDisabled ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                    {props.icon}
                </span>
                <span className={props.cooldown.isDisabled ? "text-muted-foreground" : ""}>
                    {props.label}
                </span>
            </span>

            {props.cooldown.isDisabled ? (
                <div className="flex items-center gap-1.5 text-orange-500">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs font-mono">{props.cooldown.text}</span>
                </div>
            ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
        </Button>
    );
}