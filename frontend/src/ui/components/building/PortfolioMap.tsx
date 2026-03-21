import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Building } from "@autocoderz/shared";
import { MapPin } from "lucide-react";

const icon = L.divIcon({
  className: "",
  html: `<div style="font-size:28px;">📍</div>`
});

type MarkerType = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
};

export default function PortfolioMap({ buildings }: { buildings: Building[] }) {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!buildings || buildings.length === 0) {
      setLoading(false);
      return;
    }

    const load = async () => {
      let results: MarkerType[] = [];

      for (let b of buildings) {
        if (!b.address) continue;

        try {
          await new Promise(r => setTimeout(r, 500));

          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(b.address)}`
          );

          const data = await res.json();

          if (data && data[0]) {
            results.push({
              id: b.id,
              name: b.name,
              address: b.address,
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon)
            });
          }
        } catch (e) {
          console.log("geocode failed:", b.address);
        }
      }

      setMarkers(results);
      setLoading(false);
    };

    load().catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [buildings]);

  if (error) {
    return (
      <Card className="w-full py-12 flex items-center justify-center border-red-200 bg-red-50">
        <p className="text-red-600">Error loading map.</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center animate-pulse">
          <MapPin className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">Loading map...</p>
        </div>
      </Card>
    );
  }

  if (markers.length === 0) {
    return (
      <Card className="w-full py-12 flex items-center justify-center">
        <p>No locations found</p>
      </Card>
    );
  }

  const avgLat =
    markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
  const avgLon =
    markers.reduce((sum, m) => sum + m.lon, 0) / markers.length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 border-b">
        <CardTitle className="text-sm flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Portfolio Map
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 h-[400px]">
        <MapContainer
          center={[avgLat, avgLon]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lon]} icon={icon}>
              <Popup>
                <div>
                  <strong>{m.name}</strong>
                  <br />
                  {m.address}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}