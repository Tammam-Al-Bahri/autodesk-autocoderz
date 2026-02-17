import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WalkIn() {
    const [is_processing, set_processing] = useState(false);
    
    const [name, set_name] = useState("");
    const [nights, set_nights] = useState("1");
    const [card, set_card] = useState("");

    const handle_booking = (e: any) => {
        e.preventDefault();
        
        set_processing(true);

        setTimeout(() => {
            set_processing(false);
            alert(`Booking confirmed for ${name}! Please assign them a clean room on the Room Status board.`);
            
            set_name("");
            set_nights("1");
            set_card("");
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 px-4 mb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight mb-1">Walk-in Booking</h1>
                <p className="text-slate-500">Process a new reservation at the desk.</p>
            </div>

            <Card className="border-2 shadow-sm">
                <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b mb-4">
                    <CardTitle>Guest Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handle_booking} className="flex flex-col gap-5">
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                            <Input 
                                required 
                                value={name} 
                                onChange={e => set_name(e.target.value)} 
                                placeholder="e.g. Alice Johnson" 
                                className="mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Number of Nights</label>
                                <Input 
                                    required 
                                    type="number" 
                                    min="1" 
                                    value={nights} 
                                    onChange={e => set_nights(e.target.value)} 
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Payment Card (Last 4)</label>
                                <Input 
                                    required 
                                    maxLength={4} 
                                    value={card} 
                                    onChange={e => set_card(e.target.value)} 
                                    placeholder="1234" 
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4 h-12 text-lg" disabled={is_processing}>
                            {is_processing ? "Processing Payment..." : "Confirm Reservation"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}