import { useEffect, useState } from "react";
import { buildingGroupsBase, type BuildingGroup } from "@autocoderz/shared";
import { apiFetch, apiUrl } from "@/lib/utils";
import { toast } from "sonner";

import { BuildingGroupForm } from "@/components/building-group/BuildingGroupForm";
import BuildingGroupTable from "@/components/building-group/BuildingGroupTable";

export default function MyBuildingGroups() {
    const [data, setData] = useState<BuildingGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiFetch(`${apiUrl}${buildingGroupsBase}`);
                const resData = await response.json();

                if (response.ok) {
                    setData(resData.data);
                } else {
                    const { title, description } = resData.error;
                    toast.error(title, { description });
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
            <BuildingGroupForm setData={setData} />
            <BuildingGroupTable data={data} loading={loading} />
        </div>
    );
}
