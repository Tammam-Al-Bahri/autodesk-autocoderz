import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch, apiUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function StaffTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Temporary ID for testing until Auth context is fully utilised
  const currentUserId = "maint_01"; 

  useEffect(() => {
    const getMyTasks = async () => {
      try {
        const res = await apiFetch(`${apiUrl}/rooms`, { credentials: "include" });
        const result = await res.json();
        
        if (res.ok) {
          // Filter rooms that are assigned to the logged-in user
          const myAssignedRooms = result.data.filter((r: any) => r.assignedToId === currentUserId);
          setTasks(myAssignedRooms);
        }
      } catch (err) {
        toast.error("Error fetching tasks");
      } finally {
        setLoading(false);
      }
    };
    getMyTasks();
  }, []);

  const handleComplete = async (roomId: string) => {
    try {
      const res = await apiFetch(`${apiUrl}/rooms/clean`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });

      if (res.ok) {
        // Clear the task from the local list
        setTasks(tasks.filter((t) => t.id !== roomId));
        toast.success("Task completed!");
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading tasks...</div>;

  return (
    <div className="max-w-md mx-auto mt-6 px-4 pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-800">My Tasks</h1>
        <p className="text-sm text-slate-500 font-medium">Work orders assigned to me.</p>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed rounded-2xl bg-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase">No tasks found</p>
          </div>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="border-2 shadow-sm">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-black text-slate-800">Room {task.number}</span>
                      <Badge className="bg-amber-500">{task.status}</Badge>
                    </div>
                    <p className="text-xs font-bold text-blue-600 italic">
                      "Assigned by: {task.assignedByName || "Reception"}"
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="bg-green-600 text-white font-black px-6"
                    onClick={() => handleComplete(task.id)}
                  >
                    Done
                  </Button>
                </div>

                <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Location</p>
                    <p className="text-sm font-bold text-slate-600">Main Building</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}