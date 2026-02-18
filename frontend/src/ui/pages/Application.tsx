import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Applications() {

  const [applications, setApplications] = useState([
    {
      id: 812,
      name: "The Glasshouse",
      location: "Sheffield",
      file: "Glasshouse_final_v2.rvt",
      time: "2 hours ago",
    },
    {
      id: 443,
      name: "Victoria Inn",
      location: "London",
      file: "Vic_Final.rvt",
      time: "1 day ago",
    },
  ]);

  const [selected, setSelected] = useState<any | null>(null);

  function handleAction(type: string) {

    if (!selected) return;

    alert(type === "Approved" ? "Property approved." : "Property rejected.");

    setApplications(applications.filter((a) => a.id !== selected.id));
    setSelected(null);
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4 pb-16">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pending Applications</h1>
        <p className="text-sm text-gray-500">
          Review submitted properties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="space-y-4">

          {applications.length === 0 && (
            <p className="text-sm text-gray-500">
              No applications to review.
            </p>
          )}

          {applications.map((item) => {

            const isActive = selected?.id === item.id;

            return (
              <Card
                key={item.id}
                className={`cursor-pointer ${isActive ? "border-2 border-blue-500" : ""}`}
                onClick={() => setSelected(item)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{item.name}</p>
                    <Badge variant="secondary">Pending</Badge>
                  </div>

                  <p className="text-sm text-gray-500">
                    {item.location}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {item.file}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="md:col-span-2">

          {!selected ? (
            <Card className="min-h-[400px] flex items-center justify-center">
              <CardContent>
                <p className="text-sm text-gray-500 text-center">
                  Select an application to review.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle>{selected.name}</CardTitle>
                <p className="text-sm text-gray-500">
                  Submitted {selected.time}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">

                <div className="h-72 border rounded flex items-center justify-center">
                  <p className="text-sm text-gray-400">
                    3D Viewer Placeholder
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="destructive"
                    onClick={() => handleAction("Rejected")}
                  >
                    Reject
                  </Button>

                  <Button
                    onClick={() => handleAction("Approved")}
                  >
                    Approve
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
