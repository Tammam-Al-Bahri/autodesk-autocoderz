import { type ColumnDef } from "@tanstack/react-table";
import { type BuildingGroup } from "@autocoderz/shared";

export const columns: ColumnDef<BuildingGroup>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
];
