import { columns } from "./columns";
import {
    buildingsBase,
    buildingsRoutes,
    type BuildingId,
    type BuildingStaffTable,
} from "@autocoderz/shared";
import { DataTable } from "@/components/ui/data-table";
import { apiFetch, apiUrl, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function BuildingStaffTable({ buildingId }: { buildingId: BuildingId }) {
    const [data, setData] = useState<BuildingStaffTable[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await apiFetch(
                    `${apiUrl}${buildingsBase}${buildingsRoutes.staff}?buildingId=${buildingId}`,
                    { method: "GET" }
                );

                const json = await res.json();

                if (res.ok) {
                    setData(json.data);
                } else {
                    toast.error(json.error?.title || "Error");
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [buildingId]);

    if (loading) {
        return (
            <Card className="p-6">
                <p className="text-sm">Loading...</p>
            </Card>
        );
    }

    return (
        <Card className={cn("p-4")}>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                    Building Staff ({data.length})
                </CardTitle>
            </CardHeader>

            <CardContent>
                {data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No staff added yet.
                    </p>
                ) : (
                    <DataTable columns={columns} data={data} />
                )}
            </CardContent>
        </Card>
    );
}