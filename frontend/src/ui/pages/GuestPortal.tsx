import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AutodeskViewer from "@/components/AutodeskViewer";
import { apiUrl } from "@/lib/utils";
import { apsBase, apsRoutes } from "@autocoderz/shared";
import {
  Bed,
  Wind,
  Tv,
  Shield,
  Refrigerator,
  Utensils,
  Sparkles,
  LogOut,
  KeyRound,
  Info,
  ChevronRight
} from "lucide-react";

const SNOWDON_URN =
  "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXV0b2NvZGVyel9wZXJtYW5lbnRfc3RvcmFnZS9Tbm93ZG9uX1Rvd2Vyc19GaW5hbC5ydnQ";

export default function GuestPortal() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [booking, setBooking] = useState("");
  const [token, setToken] = useState("");

  const roomNumber = "204";


  useEffect(() => {

    fetch(`${apiUrl}${apsBase}${apsRoutes.viewerToken}`)
      .then((res) => res.json())
      .then((data) => {
        setToken(data.access_token);
      })
      .catch((err) => {
        console.error("Could not get viewer token", err);
      });

  }, []);


  function login() {

    if (booking.length > 3) {
      setLoggedIn(true);
    } else {
      alert("Please enter a valid booking ID");
    }

  }


  if (!loggedIn) {

    return (

      <div className="min-h-screen flex items-center justify-center px-4 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb')] bg-cover bg-center">

        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <Card className="w-full max-w-md relative bg-white/90 backdrop-blur-md border-none shadow-2xl">

          <CardHeader className="pt-8">

            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="text-white w-6 h-6" />
            </div>

            <CardTitle className="text-2xl font-black text-center">
              Snowdon Guest Login
            </CardTitle>

            <p className="text-center text-slate-500 text-sm">
              Enter your booking reference to access your room.
            </p>

          </CardHeader>

          <CardContent className="space-y-4 pb-10">

            <Input
              placeholder="Booking ID"
              value={booking}
              className="h-12"
              onChange={(e) => setBooking(e.target.value)}
            />

            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              onClick={login}
            >
              Enter Room
            </Button>

          </CardContent>

        </Card>

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-slate-50/50 pb-20">


      <div className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0">

        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <div>

            <div className="flex items-center gap-2">

              <Badge className="bg-emerald-100 text-emerald-700 border-none">
                LIVE
              </Badge>

              <h1 className="text-2xl font-black">
                Suite {roomNumber}
              </h1>

            </div>

            <p className="text-xs text-slate-400 uppercase mt-1">
              Snowdon Towers
            </p>

          </div>


          <Button
            variant="ghost"
            onClick={() => setLoggedIn(false)}
            className="text-slate-400 hover:text-rose-600"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>

        </div>

      </div>


      <div className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">



        <div className="lg:col-span-2 space-y-6">

          <Card className="border-none shadow-xl bg-slate-900 overflow-hidden min-h-[500px]">

            <CardContent className="p-0 h-full">

              {token ? (

                <AutodeskViewer urn={SNOWDON_URN} token={token} />

              ) : (

                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 py-40">

                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

                  <p className="text-xs uppercase font-mono">
                    Loading building model...
                  </p>

                </div>

              )}

            </CardContent>

          </Card>



          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            <Amenity icon={<Bed />} label="King Bed" />
            <Amenity icon={<Refrigerator />} label="Mini Bar" />
            <Amenity icon={<Shield />} label="Safe" />
            <Amenity icon={<Tv />} label="Smart TV" />

          </div>

        </div>


        <div className="space-y-6">

          <Card className="shadow-lg border-none bg-gradient-to-br from-blue-600 to-indigo-700 text-white">

            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Concierge
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">

              <ServiceButton icon={<Utensils />} label="Room Service" />
              <ServiceButton icon={<Info />} label="Hotel Info" />
              <ServiceButton icon={<Wind />} label="Climate Control" />

            </CardContent>

          </Card>


          <Card className="shadow-lg border-none bg-white">

            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Quick Requests
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">

              <RequestButton icon={<Sparkles />} label="Extra Towels" />
              <RequestButton icon={<Utensils />} label="Fresh Linens" />
              <RequestButton icon={<Wind />} label="Maintenance" />

            </CardContent>

          </Card>

        </div>

      </div>

    </div>

  );

}


function Amenity({ icon, label }: { icon: any; label: string }) {
  return (
    <Card className="bg-white border-none shadow-sm hover:bg-blue-50">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className="text-slate-400 mb-2">
          {icon}
        </div>
        <p className="text-xs font-bold text-slate-600">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}


function ServiceButton({ icon, label }: { icon: any; label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20">
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span className="font-semibold text-sm">
          {label}
        </span>
      </div>

      <ChevronRight className="w-4 h-4 opacity-70" />
    </button>
  );
}


function RequestButton({ icon, label }: { icon: any; label: string }) {
  return (
    <Button variant="outline" className="justify-between w-full">
      <span className="flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </span>

      <ChevronRight className="w-4 h-4 text-slate-300" />
    </Button>
  );
}