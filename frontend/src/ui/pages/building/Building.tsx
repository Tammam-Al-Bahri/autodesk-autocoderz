import AutodeskViewer from "@/components/AutodeskViewer";
import { UploadBuildingModel } from "@/components/building/UploadBuildingModel";
import { apiUrl } from "@/lib/utils";
import { apsBase, apsRoutes, buildingsBase } from "@autocoderz/shared";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Building() {
    const { buildingId } = useParams();

    if (!buildingId) return <>no buildingId found</>;

    const [autodeskToken, setAutodeskToken] = useState("");
    const [buildingUrn, setBuildingUrn] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const method = "GET";

                const buildingRes = await fetch(
                    `${apiUrl}${buildingsBase}?buildingId=${buildingId}`,
                    {
                        method,
                        credentials: "include",
                    },
                );

                const buildingResData = await buildingRes.json();

                if (buildingRes.ok) {
                    const urn = buildingResData.data.urn;
                    if (!urn) return;
                    setBuildingUrn(urn);
                    console.log(urn);
                } else {
                    const { title, description } = buildingResData.error;
                    toast.error(title, { description });
                }

                const tokenRes = await fetch(`${apiUrl}${apsBase}${apsRoutes.viewerToken}`, {
                    method,
                    credentials: "include",
                });

                const tokenResData = await tokenRes.json();

                console.log(tokenResData.access_token);

                if (tokenRes.ok) {
                    setAutodeskToken(tokenResData.access_token);
                } else {
                    const { title, description } = tokenResData.error;
                    toast.error(title, { description });
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [buildingId]);

    return (
        <>
            building id: {buildingId}
            <UploadBuildingModel buildingId={buildingId} />
            {autodeskToken && buildingUrn && (
                <AutodeskViewer urn={buildingUrn} token={autodeskToken} />
            )}
        </>
    );
}
