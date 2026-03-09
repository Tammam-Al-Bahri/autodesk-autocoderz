import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Box,
  Wrench,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">

          <Badge className="mb-6">
            <Zap className="w-3 h-3 mr-2" />
            Built with Autodesk Platform Services
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            AUTO<span className="text-blue-600">CODERZ</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            This platform links BIM building models with hotel property management tools.
            It allows staff to view buildings in 3D and manage maintenance issues in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">

            <Button
              size="lg"
              className="px-8 h-12"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 h-12"
            >
              <Link to="/login">Partner Login</Link>
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/test")}
            >
              Demo
            </Button>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 grid md:grid-cols-3 gap-6 mb-24">

        <FeatureCard
          icon={<Box className="w-6 h-6 text-blue-600" />}
          title="3D Model Viewer"
          desc="Users can open a BIM model and explore the building in a 3D viewer directly in the browser."
        />

        <FeatureCard
          icon={<Wrench className="w-6 h-6 text-indigo-600" />}
          title="Maintenance Reporting"
          desc="Staff can report maintenance problems and attach them to specific rooms or objects inside the model."
        />

        <FeatureCard
          icon={<BarChart3 className="w-6 h-6 text-green-600" />}
          title="Management Overview"
          desc="Managers can track issues and see basic statistics about building maintenance activity."
        />

      </div>

      <div className="max-w-3xl mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">
            System Information
          </h2>
          <p className="text-slate-500 mt-2">
            Some common questions about how the system works.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">

            <Accordion type="single" collapsible className="w-full">

              <FaqItem
                value="1"
                title="How does the 3D model work?"
                content="The system converts Revit BIM models into a format that can be viewed in the browser using Autodesk Platform Services."
              />

              <FaqItem
                value="2"
                title="Who manages maintenance tickets?"
                content="Reception staff can create tickets, managers assign them, and maintenance staff resolve the issues."
              />

              <FaqItem
                value="3"
                title="Can it support multiple properties?"
                content="Yes, the system is designed so that multiple hotels or buildings can be managed within the same platform."
              />

            </Accordion>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>

        <div className="w-10 h-10 flex items-center justify-center mb-3">
          {icon}
        </div>

        <CardTitle className="text-lg font-semibold">
          {title}
        </CardTitle>

      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-600">
          {desc}
        </p>

        <div className="flex items-center text-xs text-blue-600 mt-3">
          Learn more
          <ArrowRight className="w-3 h-3 ml-1" />
        </div>

      </CardContent>
    </Card>
  );
}

function FaqItem({ value, title, content }: { value: string; title: string; content: string }) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-left">
        <span className="flex items-center">
          <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" />
          {title}
        </span>
      </AccordionTrigger>

      <AccordionContent className="text-sm text-slate-600">
        {content}
      </AccordionContent>
    </AccordionItem>
  );
}