import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

type StaffStatus = "Active" | "Inactive";

interface Staff {
  id: number;
  name: string;
  role: string;
  status: StaffStatus;
}

const initialStaff: Staff[] = [
  { id: 1, name: "Stephen James", role: "Manager", status: "Active" },
  { id: 2, name: "Jane Smith", role: "Developer", status: "Active" },
  { id: 3, name: "Bob Johnson", role: "Builder", status: "Active" },
  { id: 4, name: "Alice Brown", role: "Maid", status: "Active" },
  { id: 5, name: "Charlie Wilson", role: "Maid", status: "Active" },
  { id: 6, name: "Diana Lee", role: "Maid", status: "Inactive" },
  { id: 7, name: "Chloe Sarah", role: "Maid", status: "Inactive" },
];

export default function Staff() {
  const [staffList, setStaffList] = useState(initialStaff);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  const addStaff = () => {
    if (!name.trim() || !role.trim()) return;

    const newMember: Staff = {
      id: Date.now(),
      name,
      role,
      status: "Active",
    };

    setStaffList((prev) => [...prev, newMember]);
    setName("");
    setRole("");
  };

  const removeStaff = (id: number) => {
    setStaffList((prev) => prev.filter((member) => member.id !== id));
  };

  const toggleStatus = (id: number) => {
    setStaffList((prev) =>
      prev.map((member) =>
        member.id === id
          ? {
              ...member,
              status: member.status === "Active" ? "Inactive" : "Active",
            }
          : member
      )
    );
  };

  const filtered = staffList.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 mb-20">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-black tracking-tight">Staff Management</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Add or manage current hotel staff.
        </p>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="flex gap-3 flex-col sm:flex-row">
          <Input
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Add Staff */}
      <Card className="p-4 mb-8">
        <h2 className="text-lg font-semibold mb-3">Add New Staff</h2>

        <div className="flex gap-3 flex-col sm:flex-row">
          <Input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <Button onClick={addStaff}>Add</Button>
        </div>
      </Card>

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((staff) => (
          <Card key={staff.id}>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">{staff.name}</h2>
                <Badge>{staff.status}</Badge>
              </div>

              <p className="text-sm text-slate-600">Role: {staff.role}</p>

              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => toggleStatus(staff.id)}>
                  Toggle Status
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => removeStaff(staff.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
