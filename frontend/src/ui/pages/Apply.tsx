import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkeletonForm } from "@/components/skeleton-form";

export default function Apply() {

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [hotelName, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  function submitForm(e: any) {
    e.preventDefault();

    if (!hotelName || !address || !email) {
      alert("Please fill in all fields.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setStatus("Pending");
      alert("Application submitted.");
    }, 1500);
  }

  function withdraw() {
    const confirmBox = window.confirm(
      "Are you sure you want to withdraw this application?"
    );

    if (confirmBox) {
      setStatus("Cancelled");
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-16">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Apply to Join</h1>
        <p className="text-sm text-gray-500">
          Submit your property details for review.
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <SkeletonForm />
          </CardContent>
        </Card>
      ) : status === null ? (

        <Card>
          <CardHeader>
            <CardTitle>Property Application</CardTitle>
            <CardDescription>
              Upload your 3D model and basic details.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={submitForm} className="space-y-4">

              <div>
                <p className="text-sm mb-1">Hotel Name</p>
                <Input
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="Grand Marina Resort"
                />
              </div>

              <div>
                <p className="text-sm mb-1">Address</p>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full street address"
                />
              </div>

              <div>
                <p className="text-sm mb-1">Email</p>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@hotel.com"
                />
              </div>

              <div>
                <p className="text-sm mb-1">3D Model File</p>
                <Input type="file" accept=".rvt,.ifc,.dwg" />
                <p className="text-xs text-gray-400 mt-1">
                  Max 50MB
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>

            </form>
          </CardContent>
        </Card>

      ) : (

        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="border rounded p-4">
              <p className="font-semibold">
                {hotelName || "Your Property"}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">Status:</span>
                <Badge variant={status === "Pending" ? "default" : "destructive"}>
                  {status}
                </Badge>
              </div>
            </div>

            {status === "Pending" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={withdraw}
              >
                Withdraw Application
              </Button>
            )}

            {status === "Cancelled" && (
              <p className="text-sm text-gray-500 text-center">
                Application cancelled.
              </p>
            )}

          </CardContent>
        </Card>

      )}

    </div>
  );
}
