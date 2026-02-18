import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Autodesk: any;
  }
}

export default function Dashboard() {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstance = useRef<any>(null);

  // State to hold the token once we fetch it
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // encoded base64 "clientid:clientsecret"
  const ENCODED_STRING = "QVJyWHYxUk8xVjEyVVJyMkhuNWd6YjZWMlZBbjJpczNUQmZtMzVqc1ViRzZhUE1WOjBFVG9VR0k3VFFqNWVjUTNVeHBIYU11ZlJ2YUpCYzBoRklaVnFWWWpabm40WFltMFBPY2dNSjUwbkdRYkFBTGI=";
  
  // The URN of the model you want to load
  const MODEL_URN = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dHJhbnN1cmJhbi10ZXN0L3JhY19iYXNpY19zYW1wbGVfcHJvamVjdC5ydnQ"; 
  // ---------------------------------------------------------


  // get a brand new access token when the code starts running so its not expired or old
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("https://developer.api.autodesk.com/authentication/v2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${ENCODED_STRING}`,
          },
          // We request a 'client_credentials' grant with read scope
          body: new URLSearchParams({
            grant_type: "client_credentials",
            scope: "data:read viewables:read",
          }),
        });

        if (!response.ok) {
          throw new Error(`Auth failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("got token:", data.access_token);
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("error fetching token (check console):", error);
      }
    };

    fetchToken();
  }, []);


  // initialize viewer
  useEffect(() => {
    // dont start until we have a token and the ref exists
    if (!accessToken || !viewerRef.current) return;

    const viewerScript = "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js";
    const viewerStyle = "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css";

    const loadAssets = async () => {
      if (!document.querySelector(`link[href="${viewerStyle}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = viewerStyle;
        document.head.appendChild(link);
      }

      if (!window.Autodesk) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = viewerScript;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
    };

    const initViewer = async () => {
      await loadAssets();

      if (!window.Autodesk) return;

      const options = {
        env: "AutodeskProduction",
        accessToken: accessToken, // <--- Using the dynamic token here
        api: "derivativeV2",
      };

      window.Autodesk.Viewing.Initializer(options, () => {
        if (viewerInstance.current) return;

        const viewer = new window.Autodesk.Viewing.GuiViewer3D(viewerRef.current);
        viewer.start();
        viewerInstance.current = viewer;
        viewer.setTheme("light-theme");

        // Load the Model URN
        const documentId = MODEL_URN.startsWith("urn:") ? MODEL_URN : "urn:" + MODEL_URN;
        
        window.Autodesk.Viewing.Document.load(
          documentId,
          (doc: any) => {
            const defaultModel = doc.getRoot().getDefaultGeometry();
            viewer.loadDocumentNode(doc, defaultModel);
          },
          (errorCode: any, errorMsg: any) => {
            console.error("Viewer Error:", errorCode, errorMsg);
          }
        );
      });
    };

    initViewer();

    // Cleanup
    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.finish();
        viewerInstance.current = null;
      }
    };
  }, [accessToken]); // This effect runs whenever accessToken changes

  
  // UI DATA
  const hotel_db = [
    { id: "hotel_1", name: "Grand Marina Resort", check_ins: 12, check_outs: 8, occ: "82%", tickets: 3 },
    { id: "hotel_2", name: "Downtown Plaza", check_ins: 45, check_outs: 30, occ: "95%", tickets: 14 },
    { id: "hotel_3", name: "Riverside Lodge", check_ins: 5, check_outs: 2, occ: "45%", tickets: 1 }
  ];
  const [active_id, set_id] = useState("hotel_1");
  const current = hotel_db.find((h) => h.id === active_id) || hotel_db[0];

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 mb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manager Overview</h1>
          <p className="text-slate-500 mt-1">Select a property to view live stats and 3D models.</p>
        </div>
        <div className="flex flex-col gap-1 min-w-[200px]">
          <label className="text-xs font-bold text-slate-500 uppercase">Current Property</label>
          <select
            value={active_id}
            onChange={(e) => set_id(e.target.value)}
            className="p-2 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-medium cursor-pointer"
          >
            {hotel_db.map((h) => (<option key={h.id} value={h.id}>{h.name}</option>))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-slate-500 uppercase">Today's Check-ins</CardTitle></CardHeader><CardContent><p className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{current.check_ins}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-slate-500 uppercase">Today's Check-outs</CardTitle></CardHeader><CardContent><p className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{current.check_outs}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-slate-500 uppercase">Occupancy</CardTitle></CardHeader><CardContent><p className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{current.occ}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-slate-500 uppercase">Open Tickets</CardTitle></CardHeader><CardContent><p className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{current.tickets}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col min-h-[500px] border-2 border-dashed bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <div className="w-full h-full relative" style={{ minHeight: "500px" }}>
                {!accessToken && <div className="absolute inset-0 flex items-center justify-center text-slate-400">Loading Token...</div>}
                <div ref={viewerRef} className="absolute inset-0 w-full h-full z-0" />
            </div>
        </Card>
        <Card className="flex flex-col">
          <CardHeader><CardTitle className="text-lg">Recent Tickets</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="border-b pb-3"><p className="font-bold text-sm">Room 302 - Leak</p><p className="text-xs text-slate-500">Reported 2 hours ago</p></li>
              <li className="border-b pb-3"><p className="font-bold text-sm">Room 105 - Broken AC</p><p className="text-xs text-slate-500">Reported 5 hours ago</p></li>
              <li><p className="font-bold text-sm">Lobby - Lighting</p><p className="text-xs text-slate-500">Reported 1 day ago</p></li>
            </ul>
            <Button variant="outline" className="w-full mt-6">View All {current.name} Tickets</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}