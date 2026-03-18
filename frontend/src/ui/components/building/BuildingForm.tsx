import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    buildingsBase,
    buildingFormSchema as formSchema,
    type BuildingForm as FormFields,
    buildingGroupId as buildingGroupIdSchema,
    type CreateBuilding,
    type BuildingGroupId,
    type Building,
} from "@autocoderz/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { apiFetch, apiUrl, formatEnum, cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Props = {
    buildingGroupId: BuildingGroupId;
    setData: React.Dispatch<React.SetStateAction<Building[]>>;
};

export function BuildingForm({
    buildingGroupId,
    setData,
    className,
    ...props
}: Props & React.ComponentProps<"div">) {
    const form = useForm<FormFields>({
        resolver: zodResolver(formSchema),
    });

    const { handleSubmit } = form;
    const [isUpdating, setIsUpdating] = useState(false);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const bgId = buildingGroupIdSchema.safeParse(buildingGroupId);

            if (!bgId.success) {
                toast.error("Missing building group");
                return;
            }

            const fullData: CreateBuilding = {
                ...data,
                buildingGroupId: bgId.data,
            };

            setIsUpdating(true);

            const res = await apiFetch(`${apiUrl}${buildingsBase}`, {
                method: "POST",
                body: JSON.stringify(fullData),
                headers: { "Content-Type": "application/json" },
            });

            const json = await res.json();
            setIsUpdating(false);

            if (res.ok) {
                const newBuilding = json.data;
                setData((prev) => [...prev, newBuilding]);
                toast.success("Building created");
                form.reset();
            } else {
                toast.error(json.error?.title || "Error");
            }
        } catch (err) {
            setIsUpdating(false);
            console.log(err);
        }
    };

    if (isUpdating) {
        return (
            <Card className="p-6">
                <p className="text-sm">Creating building...</p>
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
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Name</FormLabel>
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
                                        <FormLabel className="text-sm">Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Address" {...field} />
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
                                            <FormLabel className="text-sm">Status</FormLabel>
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
                                                    {formSchema.shape.status.options.map(
                                                        (value) => (
                                                            <SelectItem key={value} value={value}>
                                                                {formatEnum(value)}
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
                                            <FormLabel className="text-sm">Type</FormLabel>
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
                                                    {formSchema.shape.type.options.map((value) => (
                                                        <SelectItem key={value} value={value}>
                                                            {formatEnum(value)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={isUpdating} className="w-full">
                                {isUpdating ? "Creating..." : "Create building"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
