import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center mt-12 px-4 pb-24">
            
            <div className="text-center max-w-2xl mb-16 flex flex-col items-center">
                
                <Badge variant="secondary" className="mb-6">
                    Autodesk
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Autocoderz: 3D Property Management
                </h1>
                
                <p className="text-lg text-slate-500 mb-8">
                    ....
                </p>
                
                <div className="flex justify-center gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-24">
                <Card>
                    <CardHeader>
                        <CardTitle>Interactive 3D Viewer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500">
                            ...
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Live Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500">
                            ...
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Manager Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500">
                            ...
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="w-full max-w-2xl text-left">
                <h3 className="text-2xl font-bold mb-4 text-center">System FAQ</h3>
                <Accordion type="single" collapsible className="w-full">
                    
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How does the 3D viewer work?</AccordionTrigger>
                        <AccordionContent>
                            ...
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How are maintenance tickets assigned?</AccordionTrigger>
                        <AccordionContent>
                            ....
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can I manage multiple hotels?</AccordionTrigger>
                        <AccordionContent>
                            ...
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>

        </div>
    );
}