import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Autodesk: any;
  }
}

type Props = {
  urn: string;
  token: string;
};

export default function AutodeskViewer({ urn, token }: Props) {
  const viewerDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!viewerDiv.current) {
      console.log("Viewer div not ready");
      return;
    }

    if (!window.Autodesk) {
      console.log("Autodesk not loaded");
      return;
    }

    let viewer: any;

    const options = {
      env: "AutodeskProduction",
      api: "derivativeV2",
      getAccessToken: (callback: any) => {
        callback(token, 3599);
      }
    };

    window.Autodesk.Viewing.Initializer(options, () => {
      viewer = new window.Autodesk.Viewing.GuiViewer3D(viewerDiv.current);
      viewer.start();

      const id = "urn:" + urn;

      window.Autodesk.Viewing.Document.load(
        id,
        (doc: any) => {
          const viewable = doc.getRoot().getDefaultGeometry();
          viewer.loadDocumentNode(doc, viewable);
        },
        (err: any) => {
          console.log("Error loading model", err);
        }
      );
    });

    return () => {
      if (viewer) {
        viewer.finish();
      }
    };
  }, [urn, token]);

  return <div ref={viewerDiv} className="w-full h-full" />;
}
