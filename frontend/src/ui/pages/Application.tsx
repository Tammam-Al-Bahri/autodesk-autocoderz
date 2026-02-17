import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Applications() {
    const [app_list, set_app_list] = useState<any[]>([
        { 
            id: 812, 
            name: "The Glasshouse", 
            location: "Sheffield", 
            file: "Glasshouse_final_v2.rvt",
            time: "2 hours ago"
        },
        { 
            id: 443, 
            name: "Victoria Inn", 
            location: "London", 
            file: "Vic_Final.rvt",
            time: "1 day ago"
        }
    ]);

    const [selected, set_selected] = useState<any>(null);

    const handle_action = (action: any) => {
        console.log("Action triggered:", action);

        if(action == "Approved"){
            alert("Property has been Approved!");
        } else {
            alert("Property Rejected.");
        }
        
        let new_list = [];
        for (let i = 0; i < app_list.length; i++) {
            if (app_list[i].id != selected.id) {
                new_list.push(app_list[i]);
            }
        }
        
        set_app_list(new_list);
        set_selected(null);
    };

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4 mb-20">
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Pending Applications</h1>
                <p style={{ color: 'gray' }}>
                    Review 3D Revit models and approve or reject new hotel additions.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="flex flex-col gap-4">
                    {app_list.length == 0 ? (
                        <p className="text-slate-500 mt-4 italic">No new applications to review.</p>
                    ) : null}
                    
                    {app_list.map((item) => {
                        
                        let is_active = false;
                        if (selected != null && selected.id == item.id) {
                            is_active = true;
                        }

                        return (
                            <Card 
                                key={item.id} 
                                style={{ 
                                    cursor: 'pointer', 
                                    border: is_active ? '2px solid #3b82f6' : '', 
                                    boxShadow: is_active ? '0 4px 6px rgba(0,0,0,0.1)' : '' 
                                }}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                onClick={() => {
                                    set_selected(item);
                                }}
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold">{item.name}</h3>
                                        <Badge variant="secondary">Pending</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500">Loc: {item.location}</p>
                                    <p className="text-xs text-slate-400 mt-1 font-mono">File: {item.file}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="md:col-span-2">
                    {selected == null ? (
                        <Card className="h-full min-h-[500px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-dashed border-2">
                            <p className="text-slate-500 font-medium">
                                Click an application on the left to review it.
                            </p>
                        </Card>
                    ) : (
                        <Card className="h-full min-h-[500px]">
                            <CardHeader className="border-b mb-4 bg-slate-50 dark:bg-slate-900 rounded-t-xl">
                                <CardTitle>Reviewing: {selected.name}</CardTitle>
                                <p className="text-sm text-slate-500">
                                    Submitted {selected.time}
                                </p>
                            </CardHeader>
                            
                            <CardContent className="flex flex-col gap-6">
                                
                                <div className="h-80 w-full border-2 border-dashed border-slate-300 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center rounded-lg">
                                    <p className="text-xl font-bold text-slate-400">
                                        Autodesk Forge Viewer
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Loading model: <span className="font-bold text-slate-700 dark:text-slate-300">{selected.file}</span>
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 mt-auto">
                                    <Button variant="destructive" onClick={() => handle_action("Rejected")}>
                                        Reject Property
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handle_action("Approved")}>
                                        Approve & Activate
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    )}
                </div>

            </div>
        </div>
    );
}