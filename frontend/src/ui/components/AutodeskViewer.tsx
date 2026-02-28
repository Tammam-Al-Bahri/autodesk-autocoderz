// src/components/AutodeskViewer.tsx
import { useEffect, useRef } from "react";

declare global {
    interface Window {
        Autodesk: any;
    }
}

interface Props {
    urn: string; // ← Pass the **encoded** base64url string from backend (e.g. "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnVja2V0L2ZpbGUucnZ0")
    token: string; // Fresh access token with viewables:read scope
}

export default function AutodeskViewer({ urn, token }: Props) {
    const viewerDiv = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);

    useEffect(() => {
        if (!viewerDiv.current) {
            console.warn("Viewer container not mounted yet");
            return;
        }

        if (!window.Autodesk?.Viewing) {
            console.error("Autodesk Viewing SDK failed to load – check script in index.html");
            return;
        }

        const options = {
            env: "AutodeskProduction", // ← Critical: hard-code this (fixes many recent fetch/404 issues)
            api: "derivativeV2",
            getAccessToken: (onTokenReady: (tk: string, expire: number) => void) => {
                onTokenReady(token, 3599); // ~1hr; reduce if your tokens expire faster
            },
        };

        window.Autodesk.Viewing.Initializer(options, () => {
            const viewer = new window.Autodesk.Viewing.GuiViewer3D(viewerDiv.current);
            viewer.start();
            viewerRef.current = viewer;

            // Always prefix with "urn:" – this resolves the 'traverse' undefined error in most cases
            const documentId = urn.startsWith("urn:") ? urn : `urn:${urn}`;

            console.log("Loading document with ID:", documentId);

            window.Autodesk.Viewing.Document.load(
                documentId,
                (doc: any) => {
                    console.log("Document loaded OK:", doc);

                    let viewable = doc.getRoot().getDefaultGeometry();

                    if (!viewable) {
                        // Fallback: search for any 3D geometry
                        const geoms = doc.getRoot().search({ type: "geometry", role: "3d" });
                        viewable = geoms?.[0];
                    }

                    if (!viewable) {
                        console.error(
                            "No valid 3D viewable found – translation may have failed or no 3D geometry",
                        );
                        return;
                    }

                    viewer
                        .loadDocumentNode(doc, viewable)
                        .then(() => {
                            console.log("Model successfully loaded into viewer");
                            viewer.fitToView(); // Auto-zoom to model
                        })
                        .catch((loadErr: any) => {
                            console.error("loadDocumentNode failed:", loadErr);
                        });
                },
                (errorCode: number, errorMsg: string, errors?: any[]) => {
                    console.error("Document.load() FAILED – check this for the real problem:", {
                        errorCode,
                        errorMsg,
                        urn: documentId,
                        extraErrors: errors,
                    });
                    // Useful codes:
                    // 6    → Manifest not found / bad URN
                    // 13   → Unsupported format
                    // 18   → Translation pending / in progress
                    // 404 in network → Check token or URN encoding
                },
            );
        });

        // Cleanup on unmount or prop change
        return () => {
            if (viewerRef.current) {
                viewerRef.current.finish();
                viewerRef.current = null;
            }
        };
    }, [urn, token]);

    return (
        <div
            ref={viewerDiv}
            className="w-full h-full"
            style={{ minHeight: "500px", background: "#f0f0f0" }} // Light bg helps during load
        />
    );
}
