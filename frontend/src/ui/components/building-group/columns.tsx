import { type ColumnDef } from "@tanstack/react-table";
import { type BuildingGroup } from "@autocoderz/shared";
import { Link } from "react-router-dom";
import { Building, AlignLeft } from "lucide-react";

export const columns: ColumnDef<BuildingGroup>[] = [
    {
        accessorKey: "name",
        header: "Company Portfolio",
        cell: ({ row }) => {
            const id = row.original.id;
            
            return (
                <Link 
                    to={`/building-groups/${id}`}
                    className="flex items-center gap-3 group w-fit py-1"
                >
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shadow-sm">
                        <Building className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {row.getValue("name")}
                    </span>
                </Link>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Operational Mandate",
        cell: ({ row }) => {
            const description = row.getValue("description") as string;
            
            return (
                <div className="flex items-start gap-2">
                    <AlignLeft className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm font-medium line-clamp-2 max-w-[400px] leading-relaxed">
                        {description || "No mandate specified."}
                    </span>
                </div>
            );
        },
    },
];