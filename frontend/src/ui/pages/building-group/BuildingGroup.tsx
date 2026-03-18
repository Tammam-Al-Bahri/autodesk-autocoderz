import { BuildingForm } from "@/components/building/BuildingForm";
import BuildingTable from "@/components/building/BuildingTable";
import { buildingsBase, type Building, type BuildingGroupId } from "@autocoderz/shared";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch, apiUrl } from "@/lib/utils";
import { toast } from "sonner";
import CopyId from "@/components/CopyId";

export default function BuildingGroup() {
    const { buildingGroupId } = useParams<{ buildingGroupId: BuildingGroupId }>();

    const [data, setData] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);

    if (!buildingGroupId) {
        return <div>Group ID not found</div>;
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const method = "GET";
                const response = await apiFetch(
                    `${apiUrl}${buildingsBase}?buildingGroupId=${buildingGroupId}`,
                    {
                        method,
                    },
                );
                const resData = await response.json();
                if (response.ok) {
                    setData(resData.data);
                } else {
                    const { title, description } = resData.error;
                    toast.error(title, { description });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [buildingGroupId]);

    return (
        <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
            <CopyId label="Building Group ID" value={buildingGroupId} />

            <BuildingForm buildingGroupId={buildingGroupId} setData={setData} />
            <BuildingTable data={data} loading={loading} />
        </div>
    );
}
