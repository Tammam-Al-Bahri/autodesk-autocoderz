import { columns } from "./columns";
import {
    buildingsBase,
    buildingsRoutes,
    type BuildingId,
    type BuildingStaffTable,
} from "@autocoderz/shared";
import { DataTable } from "@/components/ui/data-table";
import { apiFetch, apiUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SkeletonForm } from "@/components/skeleton-form";
import { toast } from "sonner";

export default function BuildingStaffTable({ buildingId }: { buildingId: BuildingId }) {
    const [data, setData] = useState<BuildingStaffTable[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const method = "GET";
                const response = await apiFetch(
                    `${apiUrl}${buildingsBase}${buildingsRoutes.staff}?buildingId=${buildingId}`,
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
    }, []);

    if (loading) {
        return (
            <Card className="p-6 w-full">
                <SkeletonForm />
            </Card>
        );
    }
    return <DataTable columns={columns} data={data} />;
}
