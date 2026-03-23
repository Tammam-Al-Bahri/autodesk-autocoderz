import { BuildingForm } from "@/components/building/BuildingForm";
import BuildingTable from "@/components/building/BuildingTable";
import PortfolioMap from "@/components/building/PortfolioMap";
import {
    buildingsBase,
    buildingGroupsBase,
    type Building,
    type BuildingGroupId,
    type BuildingId,
} from "@autocoderz/shared";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch, apiUrl } from "@/lib/utils";
import { toast } from "sonner";
import CopyId from "@/components/CopyId";
import { Building2, ChevronRight } from "lucide-react";

export default function BuildingGroup() {
    const { buildingGroupId } = useParams<{ buildingGroupId: BuildingGroupId }>();

    const [data, setData] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);
    const [groupName, setGroupName] = useState<string>("Loading Portfolio...");

    if (!buildingGroupId) {
        return <div>Group ID not found</div>;
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiFetch(
                    `${apiUrl}${buildingsBase}?buildingGroupId=${buildingGroupId}`,
                    { method: "GET" },
                );
                const resData = await response.json();
                if (response.ok) {
                    setData(resData.data);
                } else {
                    const { title, description } = resData.error;
                    toast.error(title, { description });
                }

                const groupResponse = await apiFetch(`${apiUrl}${buildingGroupsBase}`);
                const groupResData = await groupResponse.json();
                if (groupResponse.ok) {
                    const currentGroup = groupResData.data.find(
                        (g: any) => g.id === buildingGroupId,
                    );
                    if (currentGroup) {
                        setGroupName(currentGroup.name);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [buildingGroupId]);

    async function deleteBuilding(id: BuildingId) {
        try {
            const res = await apiFetch(`${apiUrl}${buildingsBase}?buildingId=${id}`, {
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

    async function updateBuilding(updated: Building) {
        try {
            const res = await apiFetch(`${apiUrl}${buildingsBase}?buildingId=${updated.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updated),
            });

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
            <div className="flex flex-col gap-2 mb-6 border-b border-border pb-6">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Link to="/building-groups" className="hover:text-primary transition-colors">
                        Portfolios
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span className="text-foreground font-medium">{groupName}</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground">
                            {groupName}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage all building assets assigned to this portfolio.
                        </p>
                    </div>
                </div>
            </div>

            <CopyId label="Building Group ID" value={buildingGroupId} />

            {data.length > 0 && <PortfolioMap buildings={data} />}

            <BuildingForm buildingGroupId={buildingGroupId} setData={setData} />
            <BuildingTable
                data={data}
                loading={loading}
                onDelete={deleteBuilding}
                onUpdate={updateBuilding}
            />
        </div>
    );
}
