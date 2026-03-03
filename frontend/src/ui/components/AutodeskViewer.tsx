import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

declare global {
    interface Window {
        Autodesk: any;
    }
}

interface Props {
    urn: string;
    token: string;
}

export default function AutodeskViewer({ urn, token }: Props) {
    const viewerDiv = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);

    const [status, setStatus] = useState<"translating" | "error" | "ready">("ready");
    const [attempt, setAttempt] = useState(0);
    const MAX_ATTEMPTS = 12;

    const loadModel = () => {
        if (!viewerRef.current || !urn) return;

        const documentId = urn.startsWith("urn:") ? urn : `urn:${urn}`;

        window.Autodesk.Viewing.Document.load(
            documentId,
            async (doc: any) => {
                let viewable = doc.getRoot().getDefaultGeometry();
                if (!viewable) {
                    const geoms = doc.getRoot().search({ type: "geometry", role: "3d" });
                    viewable = geoms?.[0];
                }

                if (!viewable) {
                    setStatus("translating");
                    return;
                }

                try {
                    await viewerRef.current.loadDocumentNode(doc, viewable);
                    viewerRef.current.fitToView();
                    viewerRef.current.resize();
                    setStatus("ready");
                } catch {
                    setStatus("translating");
                }
            },
            (errorCode: number) => {
                // 18 = translation still in progress
                if (errorCode === 18) {
                    setStatus("translating");
                } else {
                    setStatus("error");
                }
            },
        );
    };

    useEffect(() => {
        if (!viewerDiv.current || !window.Autodesk?.Viewing) {
            setStatus("error");
            return;
        }

        const options = {
            env: "AutodeskProduction",
            api: "derivativeV2",
            getAccessToken: (callback: (tk: string, expire: number) => void) => {
                callback(token, 3599);
            },
        };

        window.Autodesk.Viewing.Initializer(options, () => {
            const viewer = new window.Autodesk.Viewing.GuiViewer3D(viewerDiv.current);
            viewer.start();
            viewerRef.current = viewer;
            loadModel();
        });

        const handleResize = () => viewerRef.current?.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            viewerRef.current?.finish();
            viewerRef.current = null;
        };
    }, [urn, token]);

    // retry while translating
    useEffect(() => {
        if (status === "translating" && attempt < MAX_ATTEMPTS) {
            const timer = setTimeout(() => {
                setAttempt((a) => a + 1);
                loadModel();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [status, attempt]);

    return (
        <div className="relative w-full h-full min-h-125">
            <div ref={viewerDiv} className="absolute inset-0" />

            {status === "translating" && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80">
                    <Alert variant="default" className="max-w-md mb-6">
                        <AlertTitle>Model not ready yet</AlertTitle>
                        <AlertDescription>
                            Translation is still processing on Autodesk servers.
                            <br />
                            Usually ready within a few minutes.
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {status === "error" && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80">
                    <Alert variant="destructive" className="max-w-md mb-6">
                        <AlertTitle>Failed to load model</AlertTitle>
                        <AlertDescription>Could not load model.</AlertDescription>
                    </Alert>
                    <Button
                        onClick={() => {
                            setAttempt(0);
                            loadModel();
                        }}
                    >
                        Try Again
                    </Button>
                </div>
            )}
        </div>
    );
}
