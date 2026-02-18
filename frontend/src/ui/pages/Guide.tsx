import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadGuide() {

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4 pb-16">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Upload Guide</h1>
        <p className="text-sm text-gray-500">
          Make sure your 3D model follows these rules before uploading.
        </p>
      </div>

      <div className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>File Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">
              We currently support common BIM / CAD formats.
            </p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Revit (.RVT) – recommended</li>
              <li>IFC files</li>
              <li>DWG files</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Before You Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Try to keep the file under 50MB</li>
              <li>Name rooms clearly so they show properly</li>
              <li>Remove unused elements where possible</li>
              <li>Make sure the file is saved in 3D view</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Things That May Cause Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Password protected files</li>
              <li>ZIP folders</li>
              <li>Special characters in file names (e.g. @, #, $)</li>
            </ul>
          </CardContent>
        </Card>

      </div>

      <div className="mt-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">What happens after upload?</h2>
        <p className="text-sm text-gray-600">
          After submission, the file is sent to the Autodesk Forge service 
          where it gets converted into a format that can be viewed in the browser. 
          This can take a few minutes depending on the size of the model.
        </p>
      </div>

    </div>
  );
}
