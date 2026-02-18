import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StaffTasks() {

  const [tasks, setTasks] = useState([
    { id: 1, type: "Maintenance", location: "Room 302", issue: "Water leak in bathroom" },
    { id: 2, type: "Cleaning", location: "Room 103", issue: "Standard clean after checkout" },
    { id: 3, type: "Maintenance", location: "Room 105", issue: "Air conditioning not working" },
    { id: 4, type: "Cleaning", location: "Room 201", issue: "Deep clean requested" },
  ]);

  function completeTask(id: number) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <div className="max-w-md mx-auto mt-6 px-4 pb-16">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="text-sm text-gray-500">
          Maintenance and cleaning jobs assigned to you.
        </p>
      </div>

      <div className="space-y-4">

        {tasks.length === 0 && (
          <div className="text-center p-8 border rounded">
            <p className="text-sm text-gray-500">
              No tasks right now.
            </p>
          </div>
        )}

        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{task.location}</span>
                  <Badge variant={task.type === "Maintenance" ? "destructive" : "secondary"}>
                    {task.type}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600">
                  {task.issue}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => completeTask(task.id)}
              >
                Done
              </Button>

            </CardContent>
          </Card>
        ))}

      </div>

      <div className="mt-6 text-xs text-gray-400 text-center">
        Logged in as: Staff
      </div>

    </div>
  );
}
