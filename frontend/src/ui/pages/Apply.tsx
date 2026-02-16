import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SkeletonForm } from "@/components/skeleton-form";

export default function Apply() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 800);
    }, []);

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
            ) : (
                <Card className="w-full max-w-xl">
                    <CardHeader>
                        <CardTitle>Property Submission Portal</CardTitle>
                        <CardDescription>
                            Please ensure your 3D floor plans are in a compatible format for the Autodesk Forge viewer (e.g., Revit or IFC).
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form className="space-y-5">
                            
                            <div>
                                <label htmlFor="hotel_name" className="text-sm font-bold mb-1 block">
                                    Hotel Name
                                </label>
                                <Input id="hotel_name" placeholder="e.g. Grand Marina Resort" required />
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
                                <Input id="file_upload" type="file" required />
                                <p className="text-xs text-slate-500 mt-2">
                                    Max file size: 50MB. This will be processed by our Autodesk Forge integration.
                                </p>
                            </div>

                            <Button type="submit" className="w-full mt-2">
                                Submit Application
                            </Button>

                        </form>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}