import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WalkIn() {

  const [loading, setLoading] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [numNights, setNumNights] = useState(1);
  const [cardNumber, setCardNumber] = useState("");

  function submitForm(e: any) {
    e.preventDefault();

    if (!guestName || !cardNumber) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      alert("Booking saved for " + guestName);
      setLoading(false);

      setGuestName("");
      setNumNights(1);
      setCardNumber("");
    }, 1500);
  }

  return (
    <div className="max-w-xl mx-auto mt-6 px-4 pb-16">

      <h1 className="text-2xl font-bold mb-1">Walk In Booking</h1>
      <p className="text-sm text-gray-500 mb-6">
        Add a guest at reception.
      </p>

      <Card>
        <CardContent className="p-4">

          <form onSubmit={submitForm} className="space-y-4">

            <div>
              <p className="text-sm mb-1">Guest Name</p>
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Smith"
              />
            </div>

            <div>
              <p className="text-sm mb-1">Nights Staying</p>
              <Input
                type="number"
                min="1"
                value={numNights}
                onChange={(e) => setNumNights(Number(e.target.value))}
              />
            </div>

            <div>
              <p className="text-sm mb-1">Card (last 4 digits)</p>
              <Input
                maxLength={4}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : "Book Room"}
            </Button>

          </form>

        </CardContent>
      </Card>

    </div>
  );
}
