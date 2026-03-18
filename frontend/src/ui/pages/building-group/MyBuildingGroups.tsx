import { useEffect, useState } from "react";
import { buildingGroupsBase, type BuildingGroup, type BuildingGroupId } from "@autocoderz/shared";
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

    async function deleteGroup(id: BuildingGroupId) {
        try {
            const res = await apiFetch(`${apiUrl}${buildingGroupsBase}?buildingGroupId=${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok) {
                setData((prev) => prev.filter((item) => item.id !== id));
                toast.success("Deleted successfully");
            } else {
                toast.error(data.error.title, { description: data.error.description });
            }
        } catch {
            toast.error("Delete failed");
        }
    }

    async function updateGroup(updated: BuildingGroup) {
        try {
            const res = await apiFetch(
                `${apiUrl}${buildingGroupsBase}?buildingGroupId=${updated.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updated),
                },
            );

            const data = await res.json();

            if (res.ok) {
                setData((prev) => prev.map((item) => (item.id === updated.id ? data.data : item)));
                toast.success("Updated successfully");
            } else {
                toast.error(data.error.title, { description: data.error.description });
            }
        } catch {
            toast.error("Update failed");
        }
    }

    return (
        <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
            <BuildingGroupForm setData={setData} />
            <BuildingGroupTable
                data={data}
                loading={loading}
                onDelete={deleteGroup}
                onUpdate={updateGroup}
            />
        </div>
    );
}
