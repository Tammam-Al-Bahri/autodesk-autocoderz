import { type ColumnDef } from "@tanstack/react-table";
import { type BuildingGroup } from "@autocoderz/shared";
import { Link } from "react-router-dom";

export const columns: ColumnDef<BuildingGroup>[] = [
    {
        accessorKey: "name",
        header: "Company",
        cell: ({ row }) => {
            const id = row.original.id;
            return (
                <Link to={`/building-groups/${id}`}>
                    <div className="font-semibold hover:underline">{row.getValue("name")}</div>
                </Link>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
    },
];
