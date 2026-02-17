import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
    const navigate = useNavigate();

    const go_to_test = () => {
        console.log("navigating to test page...");
        navigate("/test");
    };

    return (
        <div className="max-w-6xl mx-auto px-4 mt-16 mb-24">
            
            <div className="text-center mb-16">
                <Badge variant="outline" className="mb-6 border-slate-300 px-4 py-1">
                    Powered by Autodesk
                </Badge>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                    Autocoderz <br className="hidden md:block"/> 
                    <span className="text-slate-400 font-normal">3D Property Management</span>
                </h1>
                
                <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    The central hub for hotel staff to monitor room statuses, manage live maintenance tickets, and explore properties using interactive 3D floor plans.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg" className="px-8 font-bold">
                        <Link to="/signup">Register Staff</Link>
                    </Button>
                    
                    <Button asChild variant="outline" size="lg" className="px-8 font-bold border-2">
                        <Link to="/login">System Login</Link>
                    </Button>

                    <Button variant="ghost" size="lg" onClick={go_to_test} className="text-slate-400">
                        Test Page
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                <Card className="shadow-none border-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold uppercase tracking-wide">3D Floor Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 leading-snug">
                            Uses Autodesk Forge to render exact 3D models. Click rooms within the model to check occupancy or see if they need cleaning.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-none border-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold uppercase tracking-wide">Fault Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 leading-snug">
                            Log physical issues like broken AC units or leaks. Managers can track these tickets and dispatch maintenance staff instantly.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-none border-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold uppercase tracking-wide">Manager Portal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 leading-snug">
                            A high-level overview of the entire chain. Monitor total bookings, staff availability, and urgent alerts from one place.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-2xl mx-auto border-t pt-16">
                <h3 className="text-3xl font-black mb-8 text-center uppercase">System FAQ</h3>
                <Accordion type="single" collapsible className="w-full">
                    
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="font-bold">How does the 3D viewer work?</AccordionTrigger>
                        <AccordionContent className="text-slate-500">
                            We use the Autodesk Forge API to render Revit or IFC models. This allows you to visually locate where maintenance issues are in real-time.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="font-bold">How are maintenance tickets assigned?</AccordionTrigger>
                        <AccordionContent className="text-slate-500">
                            Faults appear on the manager's dashboard. The manager can assign them to a staff member, who will see it on their portal.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="font-bold">Can I manage multiple hotels?</AccordionTrigger>
                        <AccordionContent className="text-slate-500">
                            Yes. Managers can select different properties from the dropdown to load specific 3D models and data for that site.
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>

        </div>
    );
}