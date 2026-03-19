import { columns } from "./columns";
import {
    buildingStaffBase,
    buildingStaffRoutes,
    type BuildingStaffId,
    type BuildingStaffInviteStatus,
    type BuildingStaffTable,
} from "@autocoderz/shared";
import { DataTable } from "@/components/ui/data-table";
import { apiFetch, apiUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SkeletonForm } from "@/components/skeleton-form";
import { toast } from "sonner";

export default function BuildingStaffJobsTable() {
    const [data, setData] = useState<BuildingStaffTable[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const method = "GET";
                const response = await apiFetch(`${apiUrl}${buildingStaffBase}`, {
                    method,
                });
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
    }, []);

    const handleUpdate = async (
        id: BuildingStaffId,
        status: Extract<BuildingStaffInviteStatus, "ACCEPTED" | "DECLINED">,
    ) => {
        const res = await updateInviteStatus(id, status);

        if (res) {
            setData((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
        }
    };

    if (loading) {
        return (
            <Card className="p-6 w-full">
                <SkeletonForm />
            </Card>
        );
    }
    return <DataTable columns={columns(handleUpdate)} data={data} />;
}

async function updateInviteStatus(
    buildingStaffId: BuildingStaffId,
    status: Extract<BuildingStaffInviteStatus, "ACCEPTED" | "DECLINED">,
) {
    const response = await apiFetch(
        `${apiUrl}${buildingStaffBase}${buildingStaffRoutes.manageInvite}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buildingStaffId,
                status,
            }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        const { title, description } = data.error;
        toast.error(title, { description });
    }

    return data;
}
