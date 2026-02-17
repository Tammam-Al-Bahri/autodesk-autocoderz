import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Applications() {
    const [app_list, set_app_list] = useState([
        { 
            id: 1, 
            name: "Hotel", 
            location: "Sheffield", 
            file: "Hotel1.rvt",
            time: "2 hours ago"
        },
        { 
            id: 2, 
            name: "Hotel1", 
            location: "London", 
            file: "Hotel2.rvt",
            time: "1 day ago"
        }
    ]);

    const [selected, set_selected] = useState<any>(null);

    const handle_action = (action: string) => {
        alert(`Application ${action}`);
        
        let new_list = app_list.filter(x => x.id !== selected.id);
        set_app_list(new_list);
        set_selected(null);
    };

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4 mb-20">
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Pending Applications</h1>
                <p className="text-slate-500">
                    Review 3D Revit models and approve or reject new hotel additions.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="flex flex-col gap-4">
                    {app_list.length === 0 && <p className="text-slate-500 mt-4">No new applications.</p>}
                    
                    {app_list.map((item) => (
                        <Card 
                            key={item.id} 
                            className={`cursor-pointer ${selected?.id === item.id ? "border-2 border-black" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                            onClick={() => set_selected(item)}
                        >
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold">{item.name}</h3>
                                    <Badge variant="secondary">Pending</Badge>
                                </div>
                                <p className="text-sm text-slate-500">Loc: {item.location}</p>
                                <p className="text-xs text-slate-400 mt-1">File: {item.file}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="md:col-span-2">
                    {selected ? (
                        <Card className="h-full">
                            <CardHeader className="border-b mb-4">
                                <CardTitle>Reviewing: {selected.name}</CardTitle>
                                <p className="text-sm text-slate-500">
                                    Submitted {selected.time}
                                </p>
                            </CardHeader>
                            
                            <CardContent className="flex flex-col gap-6">
                                
                                <div className="h-80 w-full border-2 border-dashed bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
                                    <p className="text-xl font-bold text-slate-400">
                                        Autodesk Viewer
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Loading model: <b>{selected.file}</b>
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button variant="destructive" onClick={() => handle_action("Rejected")}>
                                        Reject
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handle_action("Approved")}>
                                        Approve & Activate
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                            <p className="text-slate-500">
                                Click an application on the left to review it.
                            </p>
                        </Card>
                    )}
                </div>

            </div>
        </div>
    );
}