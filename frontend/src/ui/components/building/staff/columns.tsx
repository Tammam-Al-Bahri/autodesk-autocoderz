import { type ColumnDef } from "@tanstack/react-table";
import { type BuildingStaffTable } from "@autocoderz/shared";
import { formatEnum } from "@/lib/utils";

export const columns: ColumnDef<BuildingStaffTable>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const firstName = row.original.user.firstName;
            const middleName = row.original.user.middleName;
            const lastName = row.original.user.lastName;
            return (
                <div>
                    {firstName} {middleName} {lastName}
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return <div>{row.original.user.email}</div>;
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            return <div>{formatEnum(row.getValue("role"))}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <div>{formatEnum(row.getValue("status"))}</div>;
        },
    },
];
