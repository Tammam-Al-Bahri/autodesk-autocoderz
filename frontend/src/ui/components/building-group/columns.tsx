import { type ColumnDef } from "@tanstack/react-table";
import { type BuildingGroup, type BuildingGroupId } from "@autocoderz/shared";
import { Link } from "react-router-dom";
import { Building, AlignLeft, Pencil, Trash2, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type ColumnProps = {
    editingId: BuildingGroupId | null;
    setEditingId: (id: BuildingGroupId | null) => void;
    draft: Partial<BuildingGroup>;
    setDraft: React.Dispatch<React.SetStateAction<Partial<BuildingGroup>>>;
    onDelete: (id: BuildingGroupId) => void;
    onUpdate: (group: BuildingGroup) => void;
};

export const columns: ColumnDef<BuildingGroup>[] = [
    {
        accessorKey: "name",
        header: "Company",
        cell: ({ row, table }) => {
            const group = row.original;
            const { editingId, draft, setDraft } = table.options.meta as ColumnProps;
            const isEditing = editingId === group.id;

            if (isEditing) {
                return (
                    <Input
                        value={draft.name ?? group.name}
                        onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                        className="border px-2 py-1 rounded w-full"
                    />
                );
            }

            return (
                <Link
                    to={`/building-groups/${group.id}`}
                    className="flex items-center gap-3 group w-fit py-1"
                >
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shadow-sm">
                        <Building className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {group.name}
                    </span>
                </Link>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row, table }) => {
            const group = row.original;
            const { editingId, draft, setDraft } = table.options.meta as ColumnProps;
            const isEditing = editingId === group.id;

            if (isEditing) {
                return (
                    <Input
                        value={draft.description ?? group.description ?? ""}
                        onChange={(e) =>
                            setDraft((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className="border px-2 py-1 rounded w-full"
                    />
                );
            }

            return (
                <div className="flex items-start gap-2">
                    <AlignLeft className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm font-medium line-clamp-2 max-w-[400px] leading-relaxed">
                        {group.description || "No description specified."}
                    </span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
            const group = row.original;
            const { editingId, setEditingId, draft, setDraft, onDelete, onUpdate } = table.options
                .meta as ColumnProps;
            const isEditing = editingId === group.id;

            return (
                <div className="flex gap-2">
                    {isEditing ? (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                                onUpdate({
                                    ...group,
                                    name: draft.name ?? group.name,
                                    description: draft.description ?? group.description,
                                });

                                setEditingId(null);
                                setDraft({});
                            }}
                        >
                            <Check className="w-4 h-4 text-green-500" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                                setEditingId(group.id);
                                setDraft({
                                    name: group.name,
                                    description: group.description,
                                });
                            }}
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                    )}

                    <Button size="icon" variant="ghost" onClick={() => onDelete(group.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                </div>
            );
        },
    },
];
