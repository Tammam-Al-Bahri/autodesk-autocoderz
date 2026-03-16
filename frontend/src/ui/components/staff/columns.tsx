import { type ColumnDef } from "@tanstack/react-table";
import { type BuildingStaffTable } from "@autocoderz/shared";
import { formatEnum } from "@/lib/utils";
import { Link } from "react-router-dom";

export const columns: ColumnDef<BuildingStaffTable>[] = [
    {
        accessorKey: "building",
        header: "Building",
        cell: ({ row }) => {
            const name = row.original.building.name;
            const buildingId = row.original.buildingId;
            const buildingGroupId = row.original.building.buildingGroupId;
            return (
                <Link to={`/building-groups/${buildingGroupId}/buildings/${buildingId}`}>
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
];
