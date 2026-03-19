import { SkeletonForm } from "@/components/skeleton-form";
import { Card } from "@/components/ui/card";
import { apiFetch, apiUrl } from "@/lib/utils";
import { buildingStaffBase, type BuildingId, type BuildingStaffTable } from "@autocoderz/shared";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import StaffTasks from "../StaffTasks";
import Receptionist from "../Receptionist";

export default function StaffJobDashboard() {
    const { buildingId } = useParams<{ buildingId: BuildingId }>();

    const [data, setData] = useState<BuildingStaffTable[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const method = "GET";
                const response = await apiFetch(
                    `${apiUrl}${buildingStaffBase}?buildingId=${buildingId}`,
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
    }, [buildingId]);

    if (!buildingId) return <>building not found</>;

    if (loading) {
        return (
            <Card className="p-6 w-full">
                <SkeletonForm />
            </Card>
        );
    }

    // if (data[0].status === "PENDING") {
    //     return <>status = pending, TODO: accept invitation button</>;
    // }

    if (data[0].role === "RECEPTIONIST") {
        return (
            <>
                <div className="flex-col">
                    <div>staff role: {data[0].role}</div>
                    <div>staff status: {data[0].status}</div>
                    <div>buidling id: {buildingId}</div>
                    <div>buidling company id: {data[0].building.buildingGroupId}</div>
                    <div>buidling name: {data[0].building.name}</div>
                    <div>buidling address: {data[0].building.address}</div>
                    <div>buidling type: {data[0].building.type}</div>
                    <div>buidling status: {data[0].building.status}</div>
                    <div>urn: {data[0].building.urn}</div>
                </div>
                <Receptionist />
            </>
        );
    }

    if (data[0].role === "MAINTENANCE") {
        return (
            <>
                <div className="flex-col">
                    <div>staff role: {data[0].role}</div>
                    <div>staff status: {data[0].status}</div>
                    <div>buidling id: {buildingId}</div>
                    <div>buidling company id: {data[0].building.buildingGroupId}</div>
                    <div>buidling name: {data[0].building.name}</div>
                    <div>buidling address: {data[0].building.address}</div>
                    <div>buidling type: {data[0].building.type}</div>
                    <div>buidling status: {data[0].building.status}</div>
                </div>
                <StaffTasks />
            </>
        );
    }
}
