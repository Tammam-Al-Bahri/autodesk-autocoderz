import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
    const navigate = useNavigate();

    function go_to_test() {
        console.log("navigating to test page...");
        alert("Going to test page"); 
        navigate("/test");
    }

    return (
        <div className="max-w-6xl mx-auto px-4 mt-16 mb-24">
            
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                
                <Badge variant="outline" style={{ marginBottom: '24px', padding: '4px 16px', border: '1px solid #cbd5e1' }}>
                    Powered by Autodesk
                </Badge>

                <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1.1', marginBottom: '24px' }}>
                    Autocoderz <br className="hidden md:block"/>
                    <span style={{ color: 'gray', fontWeight: 'normal', fontSize: '36px' }}>3D Property Management</span>
                </h1>
                
                <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    The central hub for hotel staff to monitor room statuses, manage live maintenance tickets, and explore properties using interactive 3D floor plans.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" style={{ padding: '0 32px', fontWeight: 'bold' }} onClick={() => navigate('/signup')}>
                        Register Staff
                    </Button>
                    
                    <Button asChild variant="outline" size="lg" className="px-8 font-bold border-2">
                        <Link to="/login">System Login</Link>
                    </Button>

                    <Button variant="ghost" size="lg" onClick={go_to_test} style={{ color: '#94a3b8' }}>
                        Test Page
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                <Card style={{ boxShadow: 'none', border: '2px solid #e2e8f0' }}>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold uppercase tracking-wide">3D Floor Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p style={{ color: 'gray', lineHeight: '1.4' }}>
                            Uses Autodesk Forge to render exact 3D models. Click rooms within the model to check occupancy or see if they need cleaning.
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ boxShadow: 'none', border: '2px solid #e2e8f0' }}>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold uppercase tracking-wide">Fault Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p style={{ color: 'gray', lineHeight: '1.4' }}>
                            Log physical issues like broken AC units or leaks. Managers can track these tickets and dispatch maintenance staff instantly.
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ boxShadow: 'none', border: '2px solid #e2e8f0' }}>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold uppercase tracking-wide">Manager Portal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p style={{ color: 'gray', lineHeight: '1.4' }}>
                            A high-level overview of the entire chain. Monitor total bookings, staff availability, and urgent alerts from one place.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-2xl mx-auto border-t pt-16">
                <h3 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '32px', textAlign: 'center', textTransform: 'uppercase' }}>System FAQ</h3>
                
                <Accordion type="single" collapsible className="w-full">
                    
                    <AccordionItem value="item-1">
                        <AccordionTrigger style={{ fontWeight: 'bold' }}>How does the 3D viewer work?</AccordionTrigger>
                        <AccordionContent style={{ color: 'gray' }}>
                            We use the Autodesk Forge API to render Revit or IFC models. This allows you to visually locate where maintenance issues are in real-time.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                        <AccordionTrigger style={{ fontWeight: 'bold' }}>How are maintenance tickets assigned?</AccordionTrigger>
                        <AccordionContent style={{ color: 'gray' }}>
                            Faults appear on the manager's dashboard. The manager can assign them to a staff member, who will see it on their portal.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                        <AccordionTrigger style={{ fontWeight: 'bold' }}>Can I manage multiple hotels?</AccordionTrigger>
                        <AccordionContent style={{ color: 'gray' }}>
                            Yes. Managers can select different properties from the dropdown to load specific 3D models and data for that site.
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>

        </div>
    );
}