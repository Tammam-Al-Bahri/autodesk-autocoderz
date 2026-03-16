import { type ColumnDef } from "@tanstack/react-table";
import {
    buildingStaffBase,
    buildingStaffRoutes,
    type BuildingStaffId,
    type BuildingStaffInviteStatus,
    type BuildingStaffTable,
} from "@autocoderz/shared";
import { apiFetch, apiUrl, formatEnum } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const columns: ColumnDef<BuildingStaffTable>[] = [
    {
        accessorKey: "building",
        header: "Building",
        cell: ({ row }) => {
            const name = row.original.building.name;
            const buildingId = row.original.buildingId;
            if (row.original.status === "DECLINED") {
                return <div className="font-semibold">{name}</div>;
            }
            return (
                <Link to={`/jobs/${buildingId}`}>
                    <div className="font-semibold hover:underline">{name}</div>
                </Link>
            );
        },
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => {
            return <div>{row.original.building.address}</div>;
        },
    },
    {
        accessorKey: "buildingType",
        header: "Building Type",
        cell: ({ row }) => {
            return <div>{formatEnum(row.original.building.type)}</div>;
        },
    },
    {
        accessorKey: "buildingStatus",
        header: "Building Status",
        cell: ({ row }) => {
            return <div>{formatEnum(row.original.building.status)}</div>;
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            return <div>{formatEnum(row.original.role)}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <div>{formatEnum(row.original.status)}</div>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { status, id } = row.original;

            if (status !== "PENDING") return null;

            return (
                <div className="flex gap-2">
                    <Button onClick={() => updateInviteStatus(id, "ACCEPTED")}>Accept</Button>

                    <Button onClick={() => updateInviteStatus(id, "DECLINED")}>Decline</Button>
                </div>
            );
        },
    },
];

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
