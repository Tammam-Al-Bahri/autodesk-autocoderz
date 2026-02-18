import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {

  const [hotels] = useState([
    {
      id: "1",
      name: "Grand Plaza",
      checkIns: 12,
      checkOuts: 8,
      occupancy: "82%",
      tickets: 3
    },
    {
      id: "2",
      name: "Riverside Lodge",
      checkIns: 45,
      checkOuts: 30,
      occupancy: "95%",
      tickets: 14
    },
    {
      id: "3",
      name: "Oceanview Resort",
      checkIns: 5,
      checkOuts: 2,
      occupancy: "45%",
      tickets: 1
    }
  ]);

  const [selected, setSelected] = useState("1");

  const current = hotels.find(h => h.id === selected) || hotels[0];

  function changeHotel(e: any) {
    setSelected(e.target.value);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6 mb-16">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of selected property
        </p>
      </div>

      <div className="mb-6 max-w-xs">
        <p className="text-sm mb-1">Select Hotel</p>
        <select
          value={selected}
          onChange={changeHotel}
          className="w-full border p-2 rounded"
        >
          {hotels.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <Card>
          <CardHeader>
            <CardTitle>Check Ins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{current.checkIns}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Check Outs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{current.checkOuts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{current.occupancy}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                current.tickets > 10 ? "text-red-500" : ""
              }`}
            >
              {current.tickets}
            </p>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2 flex items-center justify-center min-h-[300px]">
          <CardContent>
            <p className="text-center text-gray-500">
              3D Viewer Placeholder
            </p>
            <p className="text-center font-semibold">
              {current.name}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent>

            <ul className="space-y-3 text-sm">
              <li>
                <p className="font-medium">Room 302 - Leak</p>
                <p className="text-gray-400">2 hrs ago</p>
              </li>
              <li>
                <p className="font-medium">Room 105 - AC issue</p>
                <p className="text-gray-400">5 hrs ago</p>
              </li>
              <li>
                <p className="font-medium">Lobby - Lights</p>
                <p className="text-gray-400">Yesterday</p>
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => alert("Going to tickets...")}
            >
              View All Tickets
            </Button>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}
