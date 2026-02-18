import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffGuide() {

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4 pb-16">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Staff Guide</h1>
        <p className="text-sm text-gray-500">
          Basic instructions for maintenance and housekeeping.
        </p>
      </div>

      <div className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Finding Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Open the “My Tasks” page</li>
              <li>Repairs are marked in red</li>
              <li>Cleaning jobs are marked differently</li>
              <li>Try to complete repairs first</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Using the 3D Model</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">
              The 3D view can help you locate the issue.
            </p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Select the room number</li>
              <li>Rotate the model to inspect the area</li>
              <li>Check asset information if needed</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completing a Job</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Click “Done” when finished</li>
              <li>The room status will update automatically</li>
              <li>If something cannot be fixed, report it</li>
            </ul>
          </CardContent>
        </Card>

      </div>

      <div className="mt-8 p-4 border rounded">
        <p className="text-sm text-gray-600">
          Updating tasks helps reception know when rooms are ready.
        </p>
      </div>

    </div>
  );
}
