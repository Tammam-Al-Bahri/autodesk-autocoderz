import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    LayoutDashboard, 
    Briefcase,
    MapPin,
    UserPlus, 
    PlusCircle, 
    CloudUpload, 
    CheckCircle2 
} from "lucide-react";

export default function ManagerGuide() {
    const steps = [
        {
            title: "1. Register a Company",
            description: "Start by registering your organisation. Provide a company name and a brief description to set up your main portfolio workspace.",
            icon: <Briefcase className="w-6 h-6 text-primary" />
        },
        {
            title: "2. Access Your Portfolio",
            description: "Navigate to the Company Portfolio to see all the different organisations you manage. Click on a specific company to open its dashboard.",
            icon: <LayoutDashboard className="w-6 h-6 text-primary" />
        },
        {
            title: "3. Create & Locate Buildings",
            description: "Create a new building by adding its name, address, status, and type. You can also view an interactive map showing where all your buildings are located.",
            icon: <MapPin className="w-6 h-6 text-primary" />
        },
        {
            title: "4. Configure Rooms",
            description: "Click on the specific property you want to view to configure its interior. You can add new rooms, as well as edit or delete existing ones.",
            icon: <PlusCircle className="w-6 h-6 text-primary" />
        },
        {
            title: "5. Invite & Manage Staff",
            description: "Invite staff to the building and assign them specific roles, such as Receptionist or Maintenance. You can view the full staff directory and check their pending invite status.",
            icon: <UserPlus className="w-6 h-6 text-primary" />
        },
        {
            title: "6. Upload 3D BIM Model",
            description: "Upload your Autodesk Revit (.rvt) model. The system synchronises with the cloud translation service to generate an interactive 3D viewer of the building.",
            icon: <CloudUpload className="w-6 h-6 text-primary" />
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                    Managerial Operations Guide
                </h1>
                <p className="text-muted-foreground">
                    Follow these steps to fully initialise and manage your digital estate.
                </p>
            </div>

            <div className="grid gap-6">
                {steps.map((step, index) => (
                    <Card key={index} className="border-2 hover:border-primary/50 transition-colors shadow-sm bg-card text-card-foreground">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                {step.icon}
                            </div>
                            <CardTitle className="text-xl font-bold">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-primary/5 border-dashed border-2 border-primary/20 text-card-foreground">
                <CardContent className="p-6 flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-primary shrink-0" />
                    <div>
                        <h4 className="font-bold text-lg">Pro Tip</h4>
                        <p className="text-sm text-muted-foreground">
                            Always ensure your 3D models are under 50MB for the fastest cloud translation 
                            and smoothest performance in the viewer.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}