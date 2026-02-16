import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto px-4 mt-12 mb-20">
            
            {/* Top section */}
            <div className="text-center mb-16">
                
                <Badge variant="secondary" className="mb-4">
                    Autodesk
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Autocoderz: 3D Property Management
                </h1>
                
                <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
                    The central platform for hotel managers to monitor room statuses, handle live maintenance tickets, and explore properties using interactive 3D floor plans.
                </p>
                
                <div className="flex justify-center gap-3">
                    <Button asChild size="lg">
                        <Link to="/signup">Register Staff</Link>
                    </Button>
                    
                    <Button asChild variant="outline" size="lg">
                        <Link to="/login">System Login</Link>
                    </Button>

                    <Button variant="secondary" size="lg" onClick={() => navigate("/test")}>
                        Test Page
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Interactive 3D Viewer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500">
                            Powered by Autodesk. Click directly on rooms within the 3D model to check occupancy or see if they need cleaning.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Live Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500">
                            Log physical faults like broken AC units or plumbing issues. Managers can track these tickets and dispatch maintenance staff.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Manager Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500">
                            A high-level overview of all properties. Monitor total bookings, staff availability, and urgent alerts from one screen.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-center">System FAQ</h3>
                <Accordion type="single" collapsible>
                    
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How does the 3D viewer work?</AccordionTrigger>
                        <AccordionContent>
                            We use the Autodesk Forge API to render exact 3D models of the hotel. This allows you to visually locate where maintenance issues are happening in real-time.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How are maintenance tickets assigned?</AccordionTrigger>
                        <AccordionContent>
                            When a fault is reported, it appears on the manager's dashboard. The manager can then assign it to a specific staff member, who will see it on their own login screen.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can I manage multiple hotels?</AccordionTrigger>
                        <AccordionContent>
                            Yes. The platform is designed to scale. Managers can select different properties from the dropdown to load the specific 3D model and data for that location.
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>

        </div>
    );
}