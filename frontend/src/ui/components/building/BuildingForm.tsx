import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    buildingsBase,
    buildingFormSchema,
    type BuildingForm,
    buildingGroupId,
    type CreateBuilding,
    type Building,
} from "@autocoderz/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { apiFetch, apiUrl, formatEnum, cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Props = {
    buildingGroupId: string;
    setData: React.Dispatch<React.SetStateAction<Building[]>>;
};

export function BuildingForm({
    buildingGroupId: groupId,
    setData,
    className,
    ...props
}: Props & React.ComponentProps<"div">) {
    const form = useForm<BuildingForm>({
        resolver: zodResolver(buildingFormSchema),
    });

    const [loading, setLoading] = useState(false);
    const [customType, setCustomType] = useState("");

    const selectedType = form.watch("type");

    const isOtherSelected = selectedType && selectedType.toString().toLowerCase() === "other";

    const onSubmit = async (data: BuildingForm) => {
        setLoading(true);

        try {
            const parsed = buildingGroupId.safeParse(groupId);

            if (!parsed.success) {
                toast.error("No group id");
                setLoading(false);
                return;
            }

            let name = data.name;

            if (isOtherSelected && customType.trim() !== "") {
                name = name + " - " + customType;
            }

            const body: CreateBuilding = {
                ...data,
                name,
                buildingGroupId: parsed.data,
            };

            const res = await apiFetch(`${apiUrl}${buildingsBase}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json = await res.json();

            if (res.ok) {
                setData((prev) => [...prev, json.data]);
                toast.success("Created");
                form.reset();
                setCustomType("");
            } else {
                toast.error(json.error?.title || "Failed", {
                    description: json.error?.description,
                });
            }
        } catch (e) {
            console.log(e);
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <Card className="p-6">
                <p className="text-sm">Creating...</p>
            </Card>
        );
    }

    return (
        <div className={cn("w-full", className)} {...props}>
            <Card className="p-4">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-lg">Create building</CardTitle>
                    <CardDescription className="text-sm">Add a new building</CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Building name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Address" {...field} 
                                            required/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                
                           />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {buildingFormSchema.shape.status.options.map(
                                                        (v) => (
                                                            <SelectItem key={v} value={v}>
                                                                {formatEnum(v)}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {buildingFormSchema.shape.type.options.map(
                                                        (v) => (
                                                            <SelectItem key={v} value={v}>
                                                                {formatEnum(v)}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {isOtherSelected && (
                                <div>
                                    <FormLabel>Custom type</FormLabel>
                                    <Input
                                        placeholder="e.g. Warehouse"
                                        value={customType}
                                        onChange={(e) => setCustomType(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Creating..." : "Create building"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
