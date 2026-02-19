import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "Builder" | "Receptionist" | "Maid";

type Staff = {
  id: number;
  firstName: string;
  lastName: string;
  role: Role;
  onDuty: boolean;
  tasks: string[];
};

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: 1001,
      firstName: "Daniel",
      lastName: "Hughes",
      role: "Builder",
      onDuty: true,
      tasks: ["Inspect west wing damage", "Meet contractors at 3 PM"]
    },
    {
      id: 1002,
      firstName: "Emily",
      lastName: "Lopez",
      role: "Maid",
      onDuty: true,
      tasks: ["Clean Room 204", "Restock Floor 3"]
    },
    {
      id: 1003,
      firstName: "Sofia",
      lastName: "Khan",
      role: "Maid",
      onDuty: false,
      tasks: ["Deep clean conference hall (scheduled)"]
    },
    {
      id: 1004,
      firstName: "Liam",
      lastName: "Patel",
      role: "Maid",
      onDuty: true,
      tasks: ["Turnover Room 310", "Laundry run for Floor 2"]
    },
    {
      id: 1005,
      firstName: "Olivia",
      lastName: "Green",
      role: "Receptionist",
      onDuty: true,
      tasks: ["Check-ins 3–6 PM", "Respond to guest emails"]
    },
    {
      id: 1006,
      firstName: "Jacob",
      lastName: "Martin",
      role: "Receptionist",
      onDuty: false,
      tasks: ["Prepare tomorrow's arrival list"]
    }
  ]);

  const [selected, setSelected] = useState<Staff | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<Role>("Maid");
  const [onDuty, setOnDuty] = useState(true);

  function addStaff() {
    if (!firstName.trim() || !lastName.trim()) return;

    const newMember: Staff = {
      id: Math.max(...staff.map(s => s.id)) + 1,
      firstName,
      lastName,
      role,
      onDuty,
      tasks: []
    };

    setStaff([...staff, newMember]);
    setFirstName("");
    setLastName("");
    setRole("Maid");
    setOnDuty(true);
  }

  function deleteStaff(id: number) {
    setStaff(staff.filter(s => s.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function toggleDuty(id: number) {
    setStaff(
      staff.map(s =>
        s.id === id ? { ...s, onDuty: !s.onDuty } : s
      )
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 pb-16">
      <h1 className="text-2xl font-bold mb-1">Staff Management</h1>
      <p className="text-sm text-gray-500 mb-6">
        Add, remove, and manage staff members.
      </p>

      <div className="grid md:grid-cols-[2fr,1.5fr] gap-6">
        {/* LEFT SIDE */}
        <div>
          <Card className="mb-6">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3">Add Staff Member</h2>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Role</Label>
                  <select
                    className="border rounded px-2 py-1 w-full text-sm"
                    value={role}
                    onChange={e => setRole(e.target.value as Role)}
                  >
                    <option value="Builder">Builder</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Maid">Maid</option>
                  </select>
                </div>

                <div>
                  <Label>Duty Status</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="sm"
                      variant={onDuty ? "default" : "outline"}
                      onClick={() => setOnDuty(true)}
                    >
                      On Duty
                    </Button>
                    <Button
                      size="sm"
                      variant={!onDuty ? "default" : "outline"}
                      onClick={() => setOnDuty(false)}
                    >
                      Off Duty
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="mt-4" size="sm" onClick={addStaff}>
                Add Staff
              </Button>
            </CardContent>
          </Card>

          {staff.map(member => (
            <Card key={member.id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-xs text-gray-400">ID #{member.id}</p>
                    <h3 className="font-semibold">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={member.onDuty ? "default" : "secondary"}>
                      {member.onDuty ? "On Duty" : "Off Duty"}
                    </Badge>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(member)}
                      >
                        Profile
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleDuty(member.id)}
                      >
                        {member.onDuty ? "Set Off Duty" : "Set On Duty"}
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteStaff(member.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3">Staff Profile</h2>

              {!selected && (
                <p className="text-sm text-gray-500">
                  Select a staff member to view details.
                </p>
              )}

              {selected && (
                <div>
                  <p className="text-xs text-gray-400">ID #{selected.id}</p>
                  <h3 className="font-semibold">
                    {selected.firstName} {selected.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{selected.role}</p>

                  <Badge variant={selected.onDuty ? "default" : "secondary"}>
                    {selected.onDuty ? "On Duty" : "Off Duty"}
                  </Badge>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Tasks</h4>

                    {selected.tasks.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No tasks assigned.
                      </p>
                    )}

                    {selected.tasks.length > 0 && (
                      <ul className="list-disc list-inside text-sm">
                        {selected.tasks.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
