import { type ColumnDef } from "@tanstack/react-table";
import { type BuildingStaffTable } from "@autocoderz/shared";
import { formatEnum } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const getColumns = (
    onRemove: (staffId: string) => void
): ColumnDef<BuildingStaffTable>[] => [
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
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onRemove(row.original.id)}
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            );
        },
    },
];


