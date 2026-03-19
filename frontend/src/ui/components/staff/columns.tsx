import { type ColumnDef } from "@tanstack/react-table";
import {
    type BuildingStaffId,
    type BuildingStaffInviteStatus,
    type BuildingStaffTable,
} from "@autocoderz/shared";
import { formatEnum } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const columns = (
    onUpdate: (
        id: BuildingStaffId,
        status: Extract<BuildingStaffInviteStatus, "ACCEPTED" | "DECLINED">,
    ) => void,
): ColumnDef<BuildingStaffTable>[] => [
    {
        accessorKey: "building",
        header: "Building",
        cell: ({ row }) => {
            const name = row.original.building.name;
            const buildingId = row.original.buildingId;
            if (row.original.status === "ACCEPTED") {
                return (
                    <Link to={`/jobs/${buildingId}`}>
                        <div className="font-semibold hover:underline">{name}</div>
                    </Link>
                );
            }
            return <div className="font-semibold">{name}</div>;
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
                    <Button onClick={() => onUpdate(id, "ACCEPTED")}>Accept</Button>
                    <Button onClick={() => onUpdate(id, "DECLINED")}>Decline</Button>
                </div>
            );
        },
    },
];
