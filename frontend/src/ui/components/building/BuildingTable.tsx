import { columns } from "./columns";
import { buildingsBase, type Building, type BuildingGroupId } from "@autocoderz/shared";
import { DataTable } from "../ui/data-table";
import { apiFetch, apiUrl, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { SkeletonForm } from "../skeleton-form";
import { toast } from "sonner";
import { ListOrdered, Loader2 } from "lucide-react";

export default function BuildingTable({ buildingGroupId }: { buildingGroupId: BuildingGroupId }) {
export default function BuildingTable({ 
    buildingGroupId, 
    className, 
    ...props 
}: { 
    buildingGroupId: string 
} & React.ComponentProps<"div">) {
    const [data, setData] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const method = "GET";
                const response = await apiFetch(
                    `${apiUrl}${buildingsBase}?buildingGroupId=${buildingGroupId}`,
                    {
                        method,
                    },
                );
                const resData = await response.json();
                if (response.ok) {
                    setData(resData.data);
                } else {
                    const { title, description } = resData.error;
                    toast.error(title, { description });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [buildingGroupId]);

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
                                A complete directory of all building assets currently assigned to this portfolio.
                            </CardDescription>
                        </div>
                        <div className="hidden sm:flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                            {data.length} {data.length === 1 ? 'Asset' : 'Assets'}
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-0 sm:p-6">
                    {data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <ListOrdered className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No properties found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                Use the form to register your first building. It will appear here once initialised.
                            </p>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={data} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}