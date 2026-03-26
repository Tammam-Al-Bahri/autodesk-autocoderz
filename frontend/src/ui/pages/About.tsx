import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ConciergeBell, Wrench, User, CheckCircle2 } from "lucide-react";

export default function About() {
    const systemRoles = [
        {
            title: "Management",
            icon: <ShieldCheck className="h-6 w-6 text-purple-600" />,
            color: "border-t-purple-500",
            description: "Manage your companies.",
            tasks: [
                "Onboard your companies",
                "Upload building models",
                "Manage staff for each building",
            ],
        },

        {
            title: "Receptionist",
            icon: <ConciergeBell className="h-6 w-6 text-emerald-600" />,
            color: "border-t-emerald-500",
            description: "Front desk staff dealing with guests and room status.",
            tasks: [
                "Check live room availability",
                "Check guests in and assign keys",
                "Report maintenance issues",
            ],
        },

        {
            title: "Maintenance",
            icon: <Wrench className="h-6 w-6 text-amber-600" />,
            color: "border-t-amber-500",
            description: "Workers who fix issues or clean rooms.",
            tasks: ["View task list on mobile", "Fix problems", "Update room status when done"],
        },

        {
            title: "Guest",
            icon: <User className="h-6 w-6 text-indigo-600" />,
            color: "border-t-indigo-500",
            description: "The person staying in the hotel.",
            tasks: [
                "Look around their room in 3D",
                "Send requests to reception",
                "Use digital hotel guide",
            ],
        },
    ];

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight mb-4">
                        <span className="text-accent-foreground">System</span> Roles
                    </h1>

                    <p className="text-lg max-w-2xl mx-auto">
                        This platform links different hotel roles together using a shared 3D system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {systemRoles.map((r, i) => {
                        return (
                            <Card
                                key={i}
                                className={`border-t-4 ${r.color} shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                            >
                                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                                    <div className={`p-2 rounded-lg`}>{r.icon}</div>

                                    <CardTitle className="text-xl font-bold">{r.title}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm mb-6 leading-relaxed">{r.description}</p>

                                    <div className="space-y-3">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                            Role
                                        </p>

                                        <ul className="space-y-2">
                                            {r.tasks.map((t, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start text-sm"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
