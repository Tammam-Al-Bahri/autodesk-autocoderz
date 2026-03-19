import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileCheck,
  AlertTriangle,
  Info,
  Layers,
  Cpu,
  CloudUpload,
  Monitor,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UploadGuide() {

  return (

    <div className="min-h-screen py-12 px-4 bg-slate-50/50">

      <div className="max-w-4xl mx-auto">


        <div className="mb-12">

          <Badge className="mb-4 bg-blue-100 text-blue-700 border-none">
            Upload Info
          </Badge>

          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Model
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
              {" "}Upload Guide
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl">
            To make sure models work properly in the 3D viewer, please follow the guidelines below before uploading.
          </p>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


          <Card className="bg-white shadow-sm border-none overflow-hidden">

            <CardHeader className="bg-slate-50/50 border-b border-slate-100">

              <CardTitle className="flex items-center text-lg">

                <FileCheck className="w-5 h-5 mr-2 text-emerald-500" />

                Supported File Types

              </CardTitle>

            </CardHeader>


            <CardContent className="pt-6">

              <div className="space-y-4">

                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                  <span className="text-sm font-bold text-slate-700">
                    Autodesk Revit
                  </span>
                  <Badge className="bg-blue-600">.RVT</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm text-slate-600">
                    IFC Format
                  </span>
                  <Badge variant="outline">.IFC</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm text-slate-600">
                    AutoCAD Drawing
                  </span>
                  <Badge variant="outline">.DWG</Badge>
                </div>

              </div>

            </CardContent>

          </Card>



          <Card className="bg-white shadow-sm border-none overflow-hidden">

            <CardHeader className="bg-slate-50/50 border-b border-slate-100">

              <CardTitle className="flex items-center text-lg">

                <Layers className="w-5 h-5 mr-2 text-blue-500" />

                Pre Upload Checklist

              </CardTitle>

            </CardHeader>


            <CardContent className="pt-6">

              <ul className="space-y-3">

                <Checklist text="Try to keep file size under 50MB" />
                <Checklist text="Use clear names for rooms and elements" />
                <Checklist text="Remove unused families and objects" />
                <Checklist text="Make sure default view is 3D" />

              </ul>

            </CardContent>

          </Card>



          <Card className="md:col-span-2 bg-rose-50/30 border border-rose-100 shadow-sm">

            <CardHeader>

              <CardTitle className="flex items-center text-lg text-rose-800">

                <AlertTriangle className="w-5 h-5 mr-2 text-rose-500" />

                Common Upload Errors

              </CardTitle>

            </CardHeader>


            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <ErrorBox text="Password protected files" />
              <ErrorBox text="ZIP files" />
              <ErrorBox text="Special characters (@,#,$)" />

            </CardContent>

          </Card>

        </div>



        <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl border border-slate-100">

          <div className="flex items-center gap-3 mb-8">

            <div className="p-2 bg-indigo-100 rounded-lg">

              <Info className="w-5 h-5 text-indigo-600" />

            </div>

            <h2 className="text-xl font-bold text-slate-900">
              What happens after upload?
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-slate-100 -z-10" />


            <UploadStep
              icon={<CloudUpload className="w-6 h-6" />}
              title="Upload"
              desc="Your model is uploaded securely to the server."
            />

            <UploadStep
              icon={<Cpu className="w-6 h-6" />}
              title="Processing"
              desc="Autodesk converts the BIM data for the web viewer."
            />

            <UploadStep
              icon={<Monitor className="w-6 h-6" />}
              title="View Model"
              desc="The 3D model becomes available in the dashboard."
            />

          </div>

        </div>

      </div>

    </div>

  );

}



function Checklist({ text }: { text: string }) {

  return (

    <li className="flex items-center text-sm text-slate-600">

      <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500 shrink-0" />

      {text}

    </li>

  );

}


function ErrorBox({ text }: { text: string }) {

  return (

    <div className="flex items-center p-3 bg-white rounded-lg border border-rose-100 text-sm text-rose-700 font-medium">

      <XCircle className="w-4 h-4 mr-2 text-rose-400" />

      {text}

    </div>

  );

}


function UploadStep({
  icon,
  title,
  desc
}: {
  icon: any;
  title: string;
  desc: string;
}) {

  return (

    <div className="flex flex-col items-center text-center">

      <div className="w-12 h-12 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center text-indigo-600 shadow-md mb-4">

        {icon}

      </div>

      <h3 className="font-bold text-slate-900 mb-1">
        {title}
      </h3>

      <p className="text-xs text-slate-500 leading-relaxed">
        {desc}
      </p>

    </div>

  );

}