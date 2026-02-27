import { columns } from "./columns";
import { buildingsBase, buildingsRoutes, type Building } from "@autocoderz/shared";
import { DataTable } from "../ui/data-table";
import { baseApiUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { SkeletonForm } from "../skeleton-form";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

export default function BuildingTable() {
    const [data, setData] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);

    const { buildingGroupId } = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const method = "GET";
                const response = await fetch(
                    `${baseApiUrl}${buildingsBase}${buildingsRoutes.root}?buildingGroupId=${buildingGroupId}`,
                    {
                        method,
                        credentials: "include",
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
