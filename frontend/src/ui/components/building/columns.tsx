import { type ColumnDef } from "@tanstack/react-table";
import { type Building } from "@autocoderz/shared";
import { Link } from "react-router-dom";
import { formatEnum } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin } from "lucide-react";

export const columns: ColumnDef<Building>[] = [
    {
        accessorKey: "name",
        header: "Building Asset",
        cell: ({ row }) => {
            const buildingId = row.original.id;
            const buildingGroupId = row.original.buildingGroupId;
            
            return (
                <Link 
                    to={`/building-groups/${buildingGroupId}/buildings/${buildingId}`}
                    className="flex items-center gap-3 group w-fit py-1"
                >
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shadow-sm">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {row.getValue("name")}
                    </span>
                </Link>
            );
        },
    },
    {
        accessorKey: "address",
        header: "Location",
        cell: ({ row }) => {
            return (
                <div className="flex items-center text-muted-foreground text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70 shrink-0" />
                    <span className="truncate max-w-[250px]">
                        {row.getValue("address")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Operational Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            
            return (
                <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none font-bold tracking-wide uppercase text-[10px]"
                >
                    {formatEnum(status)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Asset Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            
            return (
                <Badge 
                    variant="outline" 
                    className="text-muted-foreground font-medium border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                    {formatEnum(type)}
                </Badge>
            );
        },
    },
];