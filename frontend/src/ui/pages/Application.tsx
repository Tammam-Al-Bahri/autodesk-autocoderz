import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  MapPin,
  FileCode,
  Clock,
  Check,
  X,
  Eye,
  Inbox
} from "lucide-react";

export default function Applications() {

  const [apps, setApps] = useState([
    {
      id: 812,
      name: "The Glasshouse",
      location: "Sheffield, UK",
      file: "Glasshouse_final_v2.rvt",
      time: "2 hours ago",
      color: "blue"
    },
    {
      id: 443,
      name: "Victoria Inn",
      location: "London, UK",
      file: "Vic_Final.rvt",
      time: "1 day ago",
      color: "indigo"
    }
  ]);

  const [current, setCurrent] = useState<any | null>(null);


  function handleAction(action: string) {
    if (!current) return;

    const updated = apps.filter((a) => a.id !== current.id);
    setApps(updated);

    setCurrent(null);
  }


  return (
    <div className="min-h-screen py-10 px-4 bg-slate-50/50">

      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Pending <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">Review Queue</span>
            </h1>

            <p className="text-slate-500 mt-1">
              Applications waiting to be checked by admin.
            </p>
          </div>

          <Badge
            variant="outline"
            className="w-fit h-7 px-3 py-1 bg-white border-blue-200 shadow-sm text-blue-700"
          >
            {apps.length} Applications Waiting
          </Badge>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          <div className="md:col-span-4 space-y-4">

            {apps.length === 0 ? (

              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <Inbox className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm text-slate-400 font-medium">
                  No applications right now
                </p>
              </div>

            ) : (

              apps.map((item) => {

                const active = current?.id === item.id;

                return (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all duration-200 group border-l-4 ${
                      active
                        ? "border-l-blue-600 bg-blue-50/30 shadow-md ring-1 ring-blue-600/10"
                        : "border-l-transparent hover:border-l-slate-300 hover:shadow-sm bg-white"
                    }`}
                    onClick={() => setCurrent(item)}
                  >

                    <CardContent className="p-5">

                      <div className="flex justify-between items-start mb-3">

                        <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors">
                          <Building
                            className={`w-5 h-5 ${
                              active ? "text-blue-600" : "text-slate-500"
                            }`}
                          />
                        </div>

                        <Badge className={active ? "bg-blue-600" : "bg-slate-400"}>
                          Pending
                        </Badge>

                      </div>

                      <h3 className="font-bold text-lg text-slate-900">
                        {item.name}
                      </h3>

                      <div className="mt-3 space-y-1.5">

                        <div className="flex items-center text-sm text-slate-500">
                          <MapPin className="w-3.5 h-3.5 mr-2" />
                          {item.location}
                        </div>

                        <div className="flex items-center text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5 mr-2" />
                          {item.time}
                        </div>

                      </div>

                    </CardContent>

                  </Card>
                );

              })

            )}

          </div>


          <div className="md:col-span-8">

            {!current ? (

              <div className="h-[550px] bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6">

                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-slate-300" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  No Property Selected
                </h3>

                <p className="text-sm text-slate-500 mt-1 max-w-[240px]">
                  Click an application to see the BIM model and details.
                </p>

              </div>

            ) : (

              <Card className="shadow-xl border-slate-200 bg-white overflow-hidden">

                <div className="p-6 border-b bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  <div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      {current.name}
                    </h2>

                    <div className="flex items-center text-sm text-slate-500 mt-1">

                      <FileCode className="w-4 h-4 mr-1 text-blue-500" />

                      Dataset:
                      <span className="ml-1 font-mono text-xs bg-slate-200 px-1 rounded">
                        {current.file}
                      </span>

                    </div>

                  </div>

                  <div className="flex gap-2">

                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleAction("Rejected")}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>

                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                      onClick={() => handleAction("Approved")}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Property
                    </Button>

                  </div>

                </div>


                <CardContent className="p-0">

                  <div className="relative h-[450px] bg-slate-900 flex items-center justify-center">

                    <div className="absolute top-4 left-4 z-10 flex gap-2">

                      <Badge
                        variant="secondary"
                        className="bg-black/50 text-white border-none backdrop-blur-md italic"
                      >
                        BIM Render
                      </Badge>

                    </div>


                    <div className="text-center">

                      <div className="animate-pulse flex flex-col items-center">

                        <Building className="w-12 h-12 text-slate-700 mb-4" />

                        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
                          Loading 3D model...
                        </p>

                      </div>

                    </div>


                    <div className="absolute bottom-4 right-4 flex flex-col gap-2">

                      <div className="w-8 h-8 bg-white/10 rounded border border-white/20 text-white text-xs flex items-center justify-center">
                        3D
                      </div>

                      <div className="w-8 h-8 bg-white/10 rounded border border-white/20 text-white text-xs flex items-center justify-center">
                        2D
                      </div>

                    </div>

                  </div>


                  <div className="p-6 bg-slate-50 flex items-center justify-between text-xs text-slate-400">

                    <p>Asset ID: {current.id}</p>

                    <p>
                      Franchise Standards:
                      <span className="text-emerald-600 font-bold">
                        {" "}Compliant
                      </span>
                    </p>

                  </div>

                </CardContent>

              </Card>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}