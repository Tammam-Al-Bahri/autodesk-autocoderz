import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  ShieldCheck,
  ConciergeBell,
  Wrench,
  User,
  CheckCircle2
} from "lucide-react";

export default function About() {

  const systemRoles = [
    {
      title: "Hotel Applicant",
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
      color: "border-t-blue-500",
      bgColor: "bg-blue-50/50",
      description: "Hotel owners who want to add their hotel to the system.",
      tasks: [
        "Upload property details and 3D models",
        "Check progress of application",
        "Remove their application if needed"
      ]
    },

    {
      title: "Manager (Admin)",
      icon: <ShieldCheck className="h-6 w-6 text-purple-600" />,
      color: "border-t-purple-500",
      bgColor: "bg-purple-50/50",
      description: "Admin role that controls and reviews hotel submissions.",
      tasks: [
        "Look through Revit models",
        "Accept or reject hotels",
        "View system analytics"
      ]
    },

    {
      title: "Receptionist",
      icon: <ConciergeBell className="h-6 w-6 text-emerald-600" />,
      color: "border-t-emerald-500",
      bgColor: "bg-emerald-50/50",
      description: "Front desk staff dealing with guests and room status.",
      tasks: [
        "Check live room availability",
        "Check guests in and assign keys",
        "Report maintenance issues"
      ]
    },

    {
      title: "Maintenance",
      icon: <Wrench className="h-6 w-6 text-amber-600" />,
      color: "border-t-amber-500",
      bgColor: "bg-amber-50/50",
      description: "Workers who fix issues or clean rooms.",
      tasks: [
        "View task list on mobile",
        "Find problems in the 3D model",
        "Update room status when done"
      ]
    },

    {
      title: "Guest",
      icon: <User className="h-6 w-6 text-indigo-600" />,
      color: "border-t-indigo-500",
      bgColor: "bg-indigo-50/50",
      description: "The person staying in the hotel.",
      tasks: [
        "Look around their room in 3D",
        "Send requests to reception",
        "Use digital hotel guide"
      ]
    }
  ];


  return (
    <div className="min-h-screen py-12 px-4 bg-slate-50/50">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold sm:text-5xl text-slate-900 tracking-tight mb-4">
            System <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Roles & Permissions</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            This platform links different hotel roles together using a shared 3D system.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {systemRoles.map((r, i) => {

            return (
              <Card
                key={i}
                className={`border-t-4 ${r.color} bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >

                <CardHeader className="flex flex-row items-center space-x-4 pb-2">

                  <div className={`p-2 rounded-lg ${r.bgColor}`}>
                    {r.icon}
                  </div>

                  <CardTitle className="text-xl font-bold">
                    {r.title}
                  </CardTitle>

                </CardHeader>

                <CardContent>

                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    {r.description}
                  </p>

                  <div className="space-y-3">

                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Key Responsibilities
                    </p>

                    <ul className="space-y-2">

                      {r.tasks.map((t, index) => (
                        <li key={index} className="flex items-start text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-slate-300 shrink-0" />
                          {t}
                        </li>
                      ))}

                    </ul>

                  </div>

                </CardContent>

              </Card>
            )

          })}

        </div>

      </div>
    </div>
  );
}