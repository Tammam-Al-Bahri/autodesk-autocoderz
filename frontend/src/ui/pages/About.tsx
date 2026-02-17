import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
    const role_data = [
        {
            title: "Hotel Applicant",
            desc: "External business owners who want to join the Fiktional Hotels chain by submitting their hotel data.",
            tasks: [
                "Submit Applications: Upload files and hotel details via the public portal.",
                "Track Applications: Monitor if their application is Pending, Approved or Rejected.",
                "Withdraw: Cancel an application before it is approved."
            ]
        },
        {
            title: "Manager",
            desc: "The admin for the Fiktional Hotels chain responsible for quality control and portfolio oversight.",
            tasks: [
                "Review applications: Use the 3D Viewer to inspect pending hotel models for quality.",
                "Approve/Reject: Make the final decision to add a hotel to the live system.",
                "Portfolio oversight: View high-level dashboards like occupancy rates and sustainability metrics.",
                "User management: Ban abusive guests or revoke staff access."
            ]
        },
        {
            title: "Receptionist",
            desc: "Staff located at a specific hotel, managing guest check-ins and daily logistics.",
            tasks: [
                "Visualise status: Use the 3D model to see live room status (e.g., clean or dirty).",
                "Assign rooms: Check in guests and assign them to specific clean rooms.",
                "Prioritising issues: Convert guest service requests into maintenance tickets.",
                "Manage bookings: View availability calendars and manage guest details."
            ]
        },
        {
            title: "Staff (Housekeeping & Maintenance)",
            desc: "The workforce responsible for cleaning rooms and fixing reported defects.",
            tasks: [
                "View mobile tasks: Access a prioritised list of rooms to clean or fix on a mobile device.",
                "Update status: Mark rooms as Clean or Fixed (updates the Receptionist's view in real time).",
                "Locate defects: Use the 3D model to see exactly where a broken asset (e.g., a leak) is located."
            ]
        },
        {
            title: "Occupant",
            desc: "The temporary resident staying in the hotel who needs access to room amenities and services.",
            tasks: [
                "View own room: Access a restricted 3D view of only their assigned room to protect privacy.",
                "Request service: Submit requests (e.g., Extra Towels or Broken AC) directly from the app.",
                "Access information: View digital manuals for room appliances via the digital twin."
            ]
        }
    ];

    return (
        <div className="max-w-6xl mx-auto mt-16 px-4 pb-20">
            
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">System User Roles</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    The Fiktional Hotels platform is designed with Role Based Access Control (RBAC). The system adapts its dashboards and 3D viewer permissions based on the user's job.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {role_data.map((role, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                                {role.title}
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                            <p className="text-slate-600 mb-5">
                                {role.desc}
                            </p>
                            
                            <div>
                                <p className="font-bold text-sm mb-2">Responsibilities:</p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-slate-500">
                                    {role.tasks.map((task, num) => (
                                        <li key={num}>{task}</li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
        </div>
    );
}