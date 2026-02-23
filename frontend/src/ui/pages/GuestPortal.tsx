import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AutodeskViewer from "@/components/AutodeskViewer";
import { baseApiUrl } from "@/lib/utils";
import { apsBase, apsRoutes } from "@autocoderz/shared";

const SNOWDON_URN =
    "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXV0b2NvZGVyel9wZXJtYW5lbnRfc3RvcmFnZS9Tbm93ZG9uX1Rvd2Vyc19GaW5hbC5ydnQ";

export default function GuestPortal() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [bookingId, setBookingId] = useState("");
    const [apsToken, setApsToken] = useState("");

    const roomNumber = "204";

    useEffect(() => {
        fetch(`${baseApiUrl}${apsBase}${apsRoutes.viewerToken}`)
            .then((res) => res.json())
            .then((data) => {
                setApsToken(data.access_token);
            })
            .catch((err) => {
                console.error("Token fetch failed:", err);
            });
    }, []);

    const handleLogin = () => {
        if (bookingId.length > 3) {
            setIsLoggedIn(true);
        } else {
            alert("Invalid booking reference");
        }
    };

    const requestService = (type: string) => {
        alert(type + " requested");
    };

    if (!isLoggedIn) {
        return (
            <div className="max-w-md mx-auto mt-20 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Guest Login</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Enter booking code"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                        />
                        <Button className="w-full" onClick={handleLogin}>
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
                    <h1 className="text-2xl font-bold">Room {roomNumber}</h1>
                    <p className="text-sm text-gray-500">Guest portal</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
                    Logout
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 overflow-hidden flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-sm">3D Room View</CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="h-[500px] w-full bg-gray-100 relative">
                            {apsToken ? (
                                <AutodeskViewer urn={SNOWDON_URN} token={apsToken} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    Loading viewer...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Room Details</CardTitle>
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
                            <CardTitle>Request Service</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => requestService("Towels")}
                            >
                                Towels
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => requestService("Cleaning")}
                            >
                                Cleaning
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => requestService("AC")}
                            >
                                AC
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => requestService("Checkout")}
                            >
                                Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
