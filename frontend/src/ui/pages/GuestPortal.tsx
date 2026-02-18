import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GuestPortal() {
  const [is_logged_in, set_logged_in] = useState(false);
  const [booking_id, set_booking_id] = useState("");

  const room_number = "204";

  const handle_login = () => {
    if (booking_id.length > 3) {
      set_logged_in(true);
    } else {
      alert("Invalid booking reference.");
    }
  };

  const request_service = (item: string) => {
    alert(item + " request sent to reception.");
  };

  if (!is_logged_in) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Guest Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Enter your booking code.
            </p>
            <Input
              placeholder="e.g. HL3C"
              value={booking_id}
              onChange={(e) => set_booking_id(e.target.value)}
              className="text-center"
            />
            <Button className="w-full" onClick={handle_login}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4 pb-16">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Room {room_number}</h1>
          <p className="text-sm text-gray-500">Guest portal</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => set_logged_in(false)}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">3D Room View</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center bg-gray-100">
            <p className="text-gray-400">
              Viewer placeholder for Room {room_number}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="text-md">Room Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>King Bed</li>
                <li>Mini Fridge</li>
                <li>Safe</li>
                <li>Smart TV</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-md">Request Service</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => request_service("Extra Towels")}>
                Towels
              </Button>
              <Button variant="outline" size="sm" onClick={() => request_service("Cleaning")}>
                Cleaning
              </Button>
              <Button variant="outline" size="sm" onClick={() => request_service("AC Issue")}>
                AC
              </Button>
              <Button variant="outline" size="sm" onClick={() => request_service("Late Checkout")}>
                Checkout
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
