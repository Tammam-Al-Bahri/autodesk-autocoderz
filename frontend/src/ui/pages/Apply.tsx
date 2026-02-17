import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkeletonForm } from "@/components/skeleton-form";

export default function Apply() {
    console.log("Rendering Apply Page...");

    const [loading, setLoading] = useState(true);
    const [app_status, set_status] = useState<any>(null);
    const [is_uploading, set_uploading] = useState(false);
    
    const [hotel_name, set_hotel_name] = useState("");
    const [adress, set_adress] = useState("");
    const [app_email, set_email] = useState("");

    useEffect(() => {
        setTimeout(function() {
            setLoading(false);
        }, 850);
    }, []);

    function do_submit(e: any) {
        e.preventDefault(); 
        
        if(hotel_name == "" || adress == "") {
            alert("Please fill in everything first!");
            return;
        }
        
        set_uploading(true);

        setTimeout(() => {
            set_uploading(false);
            set_status("Pending");
            alert("Success! Fiktional Hotels is reviewing your application.");
        }, 2000);
    }

    const do_withdraw = () => {
        var answer = window.confirm("Are you sure you want to withdraw this application?");
        
        if (answer == true) {
            set_status("Cancelled");
        } else {
            console.log("User cancelled the cancel");
        }
    };

    return (
        <div className="flex flex-col items-center mt-12 px-4 pb-20">
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }} className="max-w-2xl">
                <h1 className="text-4xl font-bold mb-4">Join Fiktional Hotels</h1>
                <p style={{ color: 'gray', fontSize: '18px' }}>
                    Submit your property details below. Our management team will review your 3D models and contact you regarding approval.
                </p>
            </div>

            {loading == true ? (
                <Card className="w-full max-w-xl p-6">
                    <SkeletonForm />
                </Card>
            ) : app_status == null ? (
                
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
                                <label htmlFor="hotel_name" style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                                    Hotel Name
                                </label>
                                <Input 
                                    id="hotel_name" 
                                    placeholder="e.g. Grand Marina Resort" 
                                    value={hotel_name}
                                    onChange={(e) => set_hotel_name(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="prop_address" className="text-sm font-bold mb-1 block">
                                    Property Address
                                </label>
                                <Input 
                                    id="prop_address" 
                                    placeholder="Full street address" 
                                    value={adress}
                                    onChange={(e) => set_adress(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="app_email" className="text-sm font-bold mb-1 block">
                                    Applicant Email
                                </label>
                                <Input 
                                    id="app_email" 
                                    type="email" 
                                    placeholder="manager@hotel.com" 
                                    value={app_email}
                                    onChange={(e) => set_email(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="file_upload" className="text-sm font-bold mb-1 block">
                                    3D Model Upload (RVT, IFC, DWG)
                                </label>
                                <Input id="file_upload" type="file" accept=".rvt,.ifc,.dwg" />
                                <p className="text-xs text-slate-500 mt-2">
                                    Max file size: 50MB. This will be processed by our Autodesk Forge integration.
                                </p>
                            </div>

                            <Button 
                                type="submit" 
                                style={{ width: '100%', marginTop: '15px' }} 
                                disabled={is_uploading == true}
                            >
                                {is_uploading == true ? "Uploading file to cloud..." : "Submit Application"}
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
                        
                        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <h3 className="font-bold text-lg">{hotel_name != "" ? hotel_name : "Your Property"}</h3>
                            <p style={{ color: 'gray', fontSize: '14px', marginBottom: '12px' }}>Submission received.</p>
                            
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">Status:</span>
                                <Badge variant={app_status == "Pending" ? "default" : "destructive"}>
                                    {app_status}
                                </Badge>
                            </div>
                        </div>

                        {app_status == "Pending" ? (
                            <Button 
                                variant="outline" 
                                style={{ width: '100%', color: 'red', borderColor: '#fca5a5' }}
                                onClick={do_withdraw}
                            >
                                Withdraw Application
                            </Button>
                        ) : null}

                        {app_status == "Cancelled" ? (
                            <p style={{ textAlign: 'center', color: 'gray', fontSize: '14px', fontStyle: 'italic' }}>
                                You have withdrawn this application. Please refresh to start over.
                            </p>
                        ) : null}
                    </CardContent>
                </Card>
            )}

        </div>
    );
}