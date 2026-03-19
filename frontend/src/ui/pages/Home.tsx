import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Wrench, BarChart3, ArrowRight, Zap, Building, CloudUpload, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen pb-24 bg-background">
            <div className="pt-20 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">

                    <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                        <Zap className="w-3 h-3 mr-2" />
                        Built with Autodesk Platform Services
                    </Badge>

                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-foreground">
                        <span className="text-primary">AUTO</span>CODERZ
                    </h1>

                    <p className="text-lg max-w-2xl mx-auto mb-10 text-muted-foreground">
                        The central platform to manage your digital property portfolio.
                        Link BIM building models with property tools, view assets in 3D,
                        and deal with maintenance issues all in one place.
                    </p>

                    {!user ? (
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Button
                                size="lg"
                                className="px-8 h-12 bg-primary text-primary-foreground font-bold hover:scale-105 transition-all"
                                onClick={() => {
                                    navigate("/signup"); // expanded instead of inline
                                }}
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-8 grid md:grid-cols-3 gap-6 mb-24">

                <FeatureCard
                    icon={<Box className="w-6 h-6 text-primary" />}
                    title="3D Model Viewer"
                    description="Open BIM models and explore buildings in an interactive 3D viewer in the browser."
                />

                <FeatureCard
                    icon={<Wrench className="w-6 h-6 text-primary" />}
                    title="Maintenance Reporting"
                    description="Report maintenance issues and attach them to rooms or objects inside the model."
                />

                <FeatureCard
                    icon={<BarChart3 className="w-6 h-6 text-primary" />}
                    title="Management Overview"
                    description="Track issues, monitor staff activity, and view building maintenance stats."
                />
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-foreground">
                        How to get started
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Follow these steps to set up your portfolio and get things running.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <StepCard
                        number="1"
                        icon={<Building className="w-5 h-5 text-primary" />}
                        title="Initialise Portfolio"
                        description="Create your organisation and add your first building."
                    />

                    <StepCard
                        number="2"
                        icon={<CloudUpload className="w-5 h-5 text-primary" />}
                        title="Digitise Asset"
                        description="Upload RVT, IFC, or DWG files to generate your digital twin."
                    />

                    <StepCard
                        number="3"
                        icon={<Users className="w-5 h-5 text-primary" />}
                        title="Assign Personnel"
                        description="Invite staff and assign roles like receptionist or maintenance."
                    />
                </div>
            </div>
        </div>
    );
}

function FeatureCard(props: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Card className="border-border shadow-lg bg-card transition-colors hover:border-primary/30">
            <CardHeader>
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl mb-3">
                    {props.icon}
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                    {props.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    {props.description}
                </p>
            </CardContent>
        </Card>
    );
}

function StepCard(props: {
    number: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Card className="relative overflow-hidden border-border bg-card shadow-md">
            <div className="absolute -right-4 -top-4 text-9xl font-black text-muted/10 select-none">
                {props.number}
            </div>

            <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        {props.icon}
                    </div>
                    <h3 className="font-bold text-foreground">
                        {props.title}
                    </h3>
                </div>
            </CardHeader>

            <CardContent className="relative z-10">
                <p className="text-sm text-muted-foreground">
                    {props.description}
                </p>
            </CardContent>
        </Card>
    );
}