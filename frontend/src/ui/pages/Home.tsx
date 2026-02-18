import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {

  const navigate = useNavigate();

  function goToTest() {
    navigate("/test");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-12 mb-20">

      <div className="text-center mb-12">

        <Badge variant="outline" className="mb-4">
          Autodesk Integration
        </Badge>

        <h1 className="text-4xl font-bold mb-4">
          Autocoderz
        </h1>

        <p className="text-gray-500 max-w-xl mx-auto mb-6">
          A property management system for hotel staff. 
          Includes room tracking, maintenance tickets and 3D building models.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">

          <Button onClick={() => navigate("/signup")}>
            Register
          </Button>

          <Button asChild variant="outline">
            <Link to="/login">Login</Link>
          </Button>

          <Button variant="ghost" onClick={goToTest}>
            Test Page
          </Button>

        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">

        <Card>
          <CardHeader>
            <CardTitle>3D Floor Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Uses Autodesk Forge to show the building in 3D. 
              Staff can click rooms to check their status.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Staff can report issues like leaks or broken items.
              Managers can then mark them as resolved.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager View</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Overview page showing bookings and open problems
              across different hotel locations.
            </p>
          </CardContent>
        </Card>

      </div>

      <div className="max-w-2xl mx-auto">

        <h3 className="text-2xl font-bold mb-6 text-center">
          FAQ
        </h3>

        <Accordion type="single" collapsible>

          <AccordionItem value="1">
            <AccordionTrigger>
              How does the 3D model work?
            </AccordionTrigger>
            <AccordionContent>
              The system connects to Autodesk Forge and loads 
              a building model file so users can view it in the browser.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="2">
            <AccordionTrigger>
              Who handles maintenance tickets?
            </AccordionTrigger>
            <AccordionContent>
              Managers see open tickets and assign them to staff.
              Once fixed, they can mark them as resolved.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="3">
            <AccordionTrigger>
              Can this be used for multiple hotels?
            </AccordionTrigger>
            <AccordionContent>
              Yes, managers can switch between properties 
              and view their individual data.
            </AccordionContent>
          </AccordionItem>

        </Accordion>

      </div>

    </div>
  );
}
