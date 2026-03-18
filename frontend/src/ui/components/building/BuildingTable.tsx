import { columns } from "./columns";
import { type Building, type BuildingId } from "@autocoderz/shared";
import { DataTable } from "../ui/data-table";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { SkeletonForm } from "../skeleton-form";
import { ListOrdered, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
    data: Building[];
    loading: boolean;
    onDelete: (id: BuildingId) => void;
    onUpdate: (group: Building) => void;
} & React.ComponentProps<"div">;

export default function BuildingTable({
    data,
    loading,
    className,
    onDelete,
    onUpdate,
    ...props
}: Props) {
    const [editingId, setEditingId] = useState<BuildingId | null>(null);
    const [draft, setDraft] = useState<Partial<Building>>({});
    const memoData = useMemo(() => data, [data]);

    if (loading) {
        return (
            <div className={cn("w-full", className)} {...props}>
                <Card className="p-6 w-full border-border bg-card shadow-sm flex flex-col items-center justify-center min-h-[400px] transition-colors duration-300">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Loading Registry...
                    </p>
                    <div className="w-full mt-8 opacity-40">
                        <SkeletonForm />
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className={cn("w-full", className)} {...props}>
            <Card className="border-border shadow-lg bg-card overflow-hidden rounded-xl transition-colors duration-300">
                <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center text-foreground">
                                <ListOrdered className="w-6 h-6 mr-3 text-primary" />
                                Property Registry
                            </CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">
                                A complete directory of all building assets currently assigned to
                                this portfolio.
                            </CardDescription>
                        </div>
                        <div className="hidden sm:flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                            {data.length} {data.length === 1 ? "Asset" : "Assets"}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 sm:p-6">
                    {data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <ListOrdered className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">
                                No properties found
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                Use the form to register your first building. It will appear here
                                once initialised.
                            </p>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={memoData}
                            meta={{
                                editingId,
                                setEditingId,
                                draft,
                                setDraft,
                                onDelete,
                                onUpdate,
                            }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
