import { getColumns } from "./columns";
import { type BuildingStaffTable } from "@autocoderz/shared";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    data: BuildingStaffTable[];
    loading: boolean;
    onRemove: (staffId: string) => void;
};

export default function BuildingStaffTable({ data, loading, onRemove }: Props) {
    if (loading) {
        return (
            <Card className="p-6">
                <p className="text-sm">Loading...</p>
            </Card>
        );
    }

    return (
        <Card className={cn("p-4")}>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                    Building Staff ({data.length})
                </CardTitle>
            </CardHeader>

            <CardContent>
                {data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No staff added yet.</p>
                ) : (
                    <DataTable columns={getColumns(onRemove)} data={data} />
                )}
            </CardContent>
        </Card>
    );
}
