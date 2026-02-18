import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {

  const roles = [
    {
      title: "Hotel Applicant",
      description: "External owners who want to add their property.",
      tasks: [
        "Submit property details and 3D model",
        "Check application status",
        "Withdraw an application",
      ],
    },
    {
      title: "Manager (Admin)",
      description: "Oversees the full hotel system.",
      tasks: [
        "Review new hotel applications",
        "Approve or reject properties",
        "View portfolio dashboard",
        "Monitor maintenance issues",
      ],
    },
    {
      title: "Receptionist",
      description: "Front desk staff at a specific hotel.",
      tasks: [
        "View room status",
        "Check guests in",
        "Create maintenance tickets",
      ],
    },
    {
      title: "Maintenance / Housekeeping",
      description: "Staff who clean rooms or fix issues.",
      tasks: [
        "View assigned tasks",
        "Locate issues in 3D model",
        "Mark rooms as clean",
      ],
    },
    {
      title: "Guest",
      description: "Person staying in a room.",
      tasks: [
        "View their room",
        "Report an issue",
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4 pb-16">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Roles</h1>
        <p className="text-sm text-gray-500">
          Different users have different access levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {roles.map((role, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{role.title}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                {role.description}
              </p>

              <ul className="list-disc ml-5 space-y-1 text-sm">
                {role.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

      </div>

    </div>
  );
}
