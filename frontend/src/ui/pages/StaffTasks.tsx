import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch, apiUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function StaffTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [taskMessages, setTaskMessages] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  async function loadDashboard() {
    try {
      setLoading(true);
      
      const userRes = await apiFetch(`${apiUrl}/users/me`, { credentials: "include" });
      if (!userRes.ok) return;
      
      const userData = await userRes.json();
      setCurrentUser(userData.data);

      const roomRes = await apiFetch(`${apiUrl}/rooms`, { credentials: "include" });
      const roomData = await roomRes.json();
      if (roomRes.ok) {
        const myTasks = roomData.data.filter((room: any) => room.assignedToId === userData.data.id);
        setTasks(myTasks);
      }

      const historyRes = await apiFetch(`${apiUrl}/users/me/task-history`, { credentials: "include" });
      const historyData = await historyRes.json();
      if (historyRes.ok) {
        setCompletedTasks(historyData.data);
      }
    } catch (error) {
      toast.error("Network error while loading tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function completeTask(task: any) {
    try {
      const message = taskMessages[task.id] || "";
      const response = await apiFetch(`${apiUrl}/rooms/clean`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: task.id, message }),
      });

      if (response.ok) {
        toast.success("Task completed and archived!");
        setTaskMessages({...taskMessages, [task.id]: ""});
        loadDashboard(); 
      }
    } catch (error) {
      toast.error("Failed to save completion");
    }
  }

  const getDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffInMinutes = Math.round((endTime - startTime) / 60000);
    return diffInMinutes > 0 ? `${diffInMinutes} mins` : "Less than a min";
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !currentUser) {
    return <div className="p-10 text-center font-bold animate-pulse text-slate-400">Synchronising dashboard...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-6 px-4 pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-800">Maintenance</h1>
        <p className="text-sm font-medium text-slate-500 italic">Logged in as {currentUser?.firstName}</p>
      </div>

      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
        <button 
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "pending" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
        >
          Active Tasks ({tasks.length})
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === "history" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
        >
          Work Archive
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "pending" ? (
          tasks.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-2xl bg-slate-50 text-slate-400 font-bold uppercase text-xs">
              No pending tasks at the moment.
            </div>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="border-2 shadow-sm border-slate-200">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-2xl font-black text-slate-800 block">Room {task.number}</span>
                      <p className="text-xs font-bold text-blue-600">From: {task.assignedByName}</p>
                    </div>
                    <Badge className="bg-amber-500">Urgent</Badge>
                  </div>
                  
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <input 
                      type="text"
                      placeholder="Add a note (e.g. 'Changed bulbs')..."
                      className="w-full text-sm p-3 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
                      value={taskMessages[task.id] || ""}
                      onChange={(e) => setTaskMessages({...taskMessages, [task.id]: e.target.value})}
                    />
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-black"
                      onClick={() => completeTask(task)}
                    >
                      Complete Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )
        ) : (
          completedTasks.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-2xl bg-slate-50 text-slate-400 font-bold uppercase text-xs">
              No archived history found.
            </div>
          ) : (
            completedTasks.map((log) => (
              <Card key={log.id} className="border-2 shadow-sm bg-slate-50 opacity-90">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-lg font-black text-slate-700">Room {log.roomNumber}</span>
                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                      Took: {getDuration(log.assignedAt, log.completedAt)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 bg-white rounded border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Started</p>
                      <p className="text-xs font-black text-slate-700">{formatTime(log.assignedAt)}</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Finished</p>
                      <p className="text-xs font-black text-slate-700">{formatTime(log.completedAt)}</p>
                    </div>
                  </div>

                  {log.message && (
                    <p className="text-xs font-bold text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                      Note: "{log.message}"
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )
        )}
      </div>
    </div>
  );
}