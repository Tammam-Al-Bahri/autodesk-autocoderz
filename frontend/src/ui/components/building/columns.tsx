import { type ColumnDef } from "@tanstack/react-table";
import { type Building } from "@autocoderz/shared";
import { Link } from "react-router-dom";
import { formatEnum } from "@/lib/utils";

export const columns: ColumnDef<Building>[] = [
    {
        accessorKey: "name",
        header: "Building",
        cell: ({ row }) => {
            const buildingId = row.original.id;
            const buildingGroupId = row.original.buildingGroupId;
            return (
                <Link to={`/building-groups/${buildingGroupId}/buildings/${buildingId}`}>
                    <div className="font-semibold hover:underline">{row.getValue("name")}</div>
                </Link>
            );
        },
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <div>{formatEnum(row.getValue("status"))}</div>;
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            return <div>{formatEnum(row.getValue("type"))}</div>;
        },
    },
];
