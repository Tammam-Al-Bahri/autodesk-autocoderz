import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
    console.log("Loading about page...");

    const role_data = [
        {
            title: "Hotel Applicant",
            desc: "External owners who want to add their property to our system.",
            tasks: [
                "Submit 3D models and property details",
                "Check if application is pending or approved",
                "Withdraw the application"
            ]
        },
        {
            title: "Manager (Admin)",
            desc: "The boss. They look after the whole Fiktional Hotels portfolio and approve new locations.",
            tasks: [
                "Review incoming hotel applications using the 3D viewer",
                "Approve or reject new properties",
                "Look at the main portfolio dashboard",
                "Manage live maintenance tickets from all hotels"
            ]
        },
        {
            title: "Receptionist",
            desc: "Front desk staff working at one specific hotel location.",
            tasks: [
                "See which rooms are clean, dirty, or occupied on the map",
                "Check guests in and give them a room code",
                "Log a maintenance issue if a guest complains"
            ]
        },
        {
            title: "Maintenance / Housekeeping",
            desc: "Staff who actually clean the rooms or fix broken stuff.",
            tasks: [
                "Check their mobile task list",
                "Find exactly where a leak is using the 3D model",
                "Mark a room as clean so the receptionist can rent it out again"
            ]
        },
        {
            title: "Guest / Occupant",
            desc: "The person staying in the room.",
            tasks: [
                "See their specific room in 3D",
                "Request extra towels or report a fault"
            ]
        }
    ];

    return (
        <div style={{ padding: '20px' }} className="max-w-6xl mx-auto mt-10 mb-20">
            
            <div className="text-center mb-16 border-b pb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">System Roles</h1>
                
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    This system uses strict Role Based Access Control (RBAC). Dashboards and 3D viewer tools change automatically depending on who is logged in.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {role_data.map((role, i) => {
                    
                    let is_manager = false;
                    if(i == 1){
                        is_manager = true;
                    }

                    return (
                        <Card 
                            key={i} 
                            style={{ 
                                borderColor: is_manager ? '#60a5fa' : '', 
                                borderWidth: is_manager ? '2px' : '1px' 
                            }}
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-bold flex items-center justify-between">
                                    {role.title}
                                    
                                    {is_manager ? (
                                        <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 8px', borderRadius: '9999px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            Highest Access
                                        </span>
                                    ) : null}
                                </CardTitle>
                            </CardHeader>
                            
                            <CardContent>
                                <p className="text-slate-500 mb-4 italic text-sm">
                                    {role.desc}
                                </p>
                                
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md border border-slate-100 dark:border-slate-800">
                                    <p className="font-bold text-xs mb-3 uppercase tracking-wider text-slate-400">Permissions:</p>
                                    <ul className="list-disc ml-4 space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                                        {role.tasks.map((task, num) => {
                                            return <li key={num}>{task}</li>
                                        })}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            
        </div>
    );
}