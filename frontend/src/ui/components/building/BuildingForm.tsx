import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SkeletonForm } from "../skeleton-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    buildingsRoutes,
    buildingsBase,
    buildingFormSchema as formSchema,
    type BuildingForm as FormFields,
    buildingGroupId as buildingGroupIdSchema,
    type CreateBuilding,
} from "@autocoderz/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { apiUrl, formatEnum } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useParams } from "react-router-dom";

export function BuildingForm() {
    const form = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        // defaultValues: {
        //     name: "",
        //     address: "",
        //     status: formSchema.shape.status.options[0],
        //     type: formSchema.shape.type.options[0],
        // },
    });
    const { handleSubmit } = form;
    const [isUpdating, setIsUpdating] = useState(false);

    const { buildingGroupId } = useParams();

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const method = "POST";
            const bgId = buildingGroupIdSchema.safeParse(buildingGroupId);

            if (!bgId.success) {
                toast.error("Missing fields: buildingGroupId");
                return;
            }

            const fullData: CreateBuilding = { ...data, buildingGroupId: bgId.data };
            console.log(fullData);

            setIsUpdating(true);
            const response = await fetch(`${apiUrl}${buildingsBase}`, {
                method,
                credentials: "include",
                body: JSON.stringify(fullData),
                headers: { "Content-Type": "application/json" },
            });
            setIsUpdating(false);
            const resData = await response.json();
            if (response.ok) {
                toast.success(`Building ${data.name} created`, {
                    description: JSON.stringify(resData, null, 2),
                });
            } else {
                const { title, description } = resData.error;
                toast.error(title, { description });
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (isUpdating) {
        return (
            <Card className="p-6 w-full">
                <SkeletonForm />
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Building</CardTitle>
                <CardDescription>Add a new building to your company.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Fiktional Estates Group"
                                            {...field}
                                        />
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
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="S10 1WB, UK" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {formSchema.shape.status.options.map((value) => (
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
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                        <Button>Create Building</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
