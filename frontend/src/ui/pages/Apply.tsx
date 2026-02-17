import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkeletonForm } from "@/components/skeleton-form";

export default function Apply() {
    const [loading, setLoading] = useState(true);
    
    const [app_status, set_status] = useState<string | null>(null);
    const [is_uploading, set_uploading] = useState(false);
    
    const [hotel_name, set_hotel_name] = useState("");

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 800);
    }, []);

    const do_submit = (e: any) => {
        e.preventDefault();
        
        set_uploading(true);

        setTimeout(() => {
            set_uploading(false);
            set_status("Pending");
            alert("Success! Fiktional Hotels is reviewing your application.");
        }, 2000);
    };

    const do_withdraw = () => {
        let ans = window.confirm("Are you sure you want to withdraw this application?");
        if (ans) {
            set_status("Cancelled");
        }
    };

    return (
        <div className="flex flex-col items-center mt-12 px-4 pb-20">
            
            <div className="text-center max-w-2xl mb-10">
                <h1 className="text-4xl font-bold mb-4">Join Fiktional Hotels</h1>
                <p className="text-lg text-slate-500">
                    Submit your property details below. Our management team will review your 3D models and contact you regarding approval.
                </p>
            </div>

            {loading ? (
                <Card className="w-full max-w-xl p-6">
                    <SkeletonForm />
                </Card>
            ) : app_status === null ? (
                
                <Card className="w-full max-w-xl">
                    <CardHeader>
                        <CardTitle>Property Submission Portal</CardTitle>
                        <CardDescription>
                            Please ensure your 3D floor plans are in a compatible format for the Autodesk Forge viewer (e.g., Revit or IFC).
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={do_submit} className="space-y-5">
                            
                            <div>
                                <label htmlFor="hotel_name" className="text-sm font-bold mb-1 block">
                                    Hotel Name
                                </label>
                                <Input 
                                    id="hotel_name" 
                                    placeholder="e.g. Grand Marina Resort" 
                                    required 
                                    value={hotel_name}
                                    onChange={(e) => set_hotel_name(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="prop_address" className="text-sm font-bold mb-1 block">
                                    Property Address
                                </label>
                                <Input id="prop_address" placeholder="Full street address" required />
                            </div>

                            <div>
                                <label htmlFor="app_email" className="text-sm font-bold mb-1 block">
                                    Applicant Email
                                </label>
                                <Input id="app_email" type="email" placeholder="manager@hotel.com" required />
                            </div>

                            <div>
                                <label htmlFor="file_upload" className="text-sm font-bold mb-1 block">
                                    3D Model Upload (RVT, IFC, DWG)
                                </label>
                                <Input id="file_upload" type="file" accept=".rvt,.ifc,.dwg" required />
                                <p className="text-xs text-slate-500 mt-2">
                                    Max file size: 50MB. This will be processed by our Autodesk Forge integration.
                                </p>
                            </div>

                            <Button type="submit" className="w-full mt-2" disabled={is_uploading}>
                                {is_uploading ? "Uploading file to cloud..." : "Submit Application"}
                            </Button>

                        </form>
                    </CardContent>
                </Card>
            ) : (
                
                <Card className="w-full max-w-xl">
                    <CardHeader className="border-b mb-4 pb-4">
                        <CardTitle>Application Status</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 border rounded-md">
                            <h3 className="font-bold text-lg">{hotel_name || "Your Property"}</h3>
                            <p className="text-sm text-slate-500 mb-3">Submission received.</p>
                            
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">Status:</span>
                                <Badge variant={app_status === "Pending" ? "default" : "destructive"}>
                                    {app_status}
                                </Badge>
                            </div>
                        </div>

                        {app_status === "Pending" && (
                            <Button 
                                variant="outline" 
                                className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                onClick={do_withdraw}
                            >
                                Withdraw Application
                            </Button>
                        )}

                        {app_status === "Cancelled" && (
                            <p className="text-center text-sm text-slate-500 italic">
                                You have withdrawn this application. Please refresh to start over.
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

        </div>
    );
}