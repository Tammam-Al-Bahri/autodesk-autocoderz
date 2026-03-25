import { type ColumnDef } from "@tanstack/react-table";
import { type Building, type BuildingId, buildingStatus, buildingType } from "@autocoderz/shared";
import { Link } from "react-router-dom";
import { formatEnum } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, Pencil, Trash2, Check } from "lucide-react";

type ColumnProps = {
    editingId: BuildingId | null;
    setEditingId: (id: BuildingId | null) => void;
    draft: Partial<Building>;
    setDraft: React.Dispatch<React.SetStateAction<Partial<Building>>>;
    onDelete: (id: BuildingId) => void;
    onUpdate: (building: Building) => void;
};

export const columns: ColumnDef<Building>[] = [
    {
        accessorKey: "name",
        header: "Building Asset",
        cell: ({ row, table }) => {
            const building = row.original;
            const { editingId, draft, setDraft } = table.options.meta as ColumnProps;
            const isEditing = editingId === building.id;

            if (isEditing) {
                return (
                    <Input
                        value={draft.name ?? building.name}
                        onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full"
                    />
                );
            }

            return (
                <Link
                    to={`/building-groups/${building.buildingGroupId}/buildings/${building.id}`}
                    className="flex items-center gap-3 group w-fit py-1"
                >
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shadow-sm">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {building.name}
                    </span>
                </Link>
            );
        },
    },
    {
        accessorKey: "address",
        header: "Location",
        cell: ({ row, table }) => {
            const building = row.original;
            const { editingId, draft, setDraft } = table.options.meta as ColumnProps;
            const isEditing = editingId === building.id;

            if (isEditing) {
                return (
                    <Input
                        value={draft.address ?? building.address}
                        onChange={(e) => setDraft((prev) => ({ ...prev, address: e.target.value }))}
                        className="w-full"
                    />
                );
            }

            return (
                <div className="flex items-center text-muted-foreground text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70 shrink-0" />
                    <span className="truncate max-w-[250px]">{building.address}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Operational Status",
        cell: ({ row, table }) => {
            const building = row.original;
            const { editingId, draft, setDraft } = table.options.meta as ColumnProps;
            const isEditing = editingId === building.id;

            const value = draft.status ?? building.status;

            if (isEditing) {
                return (
                    <Select
                        value={value}
                        onValueChange={(val) =>
                            setDraft((prev) => ({
                                ...prev,
                                status: val as typeof value,
                            }))
                        }
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {buildingStatus.options.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {formatEnum(s)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }

            return (
                <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none font-bold tracking-wide uppercase text-[10px]"
                >
                    {formatEnum(value)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Asset Type",
        cell: ({ row, table }) => {
            const building = row.original;
            const { editingId, draft, setDraft } = table.options.meta as ColumnProps;
            const isEditing = editingId === building.id;

            const value = draft.type ?? building.type;

            if (isEditing) {
                return (
                    <Select
                        value={value}
                        onValueChange={(val) =>
                            setDraft((prev) => ({ ...prev, type: val as typeof value }))
                        }
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {buildingType.options.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {formatEnum(t)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }

            return (
                <Badge
                    variant="outline"
                    className="text-muted-foreground font-medium border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                    {formatEnum(value)}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
            const building = row.original;
            const { editingId, setEditingId, draft, setDraft, onDelete, onUpdate } = table.options
                .meta as ColumnProps;
            const isEditing = editingId === building.id;

            return (
                <div className="flex gap-2">
                    {isEditing ? (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                                onUpdate({
                                    ...building,
                                    name: draft.name ?? building.name,
                                    address: draft.address ?? building.address,
                                    status: draft.status ?? building.status,
                                    type: draft.type ?? building.type,
                                });
                                setEditingId(null);
                                setDraft({});
                            }}
                        >
                            <Check className="w-4 h-4 text-emerald-500" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                                setEditingId(building.id);
                                setDraft({
                                    name: building.name,
                                    address: building.address,
                                    status: building.status,
                                    type: building.type,
                                });
                            }}
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                    )}

                    <Button size="icon" variant="ghost" onClick={() => onDelete(building.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                </div>
            );
        },
    },
];