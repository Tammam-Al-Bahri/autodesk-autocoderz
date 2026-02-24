import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SkeletonForm } from "../skeleton-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    buildingGroupsBase,
    buildingGroupsRoutes,
    createBuildingGroupSchema as formSchema,
    type CreateBuildingGroup as FormFields,
} from "@autocoderz/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { baseApiUrl } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../ui/form";

export function BuildingGroupForm() {
    const form = useForm<FormFields>({ resolver: zodResolver(formSchema) });
    const { handleSubmit } = form;
    const [isUpdating, setIsUpdating] = useState(false);

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const method = "POST";

            setIsUpdating(true);
            const response = await fetch(
                `${baseApiUrl}${buildingGroupsBase}${buildingGroupsRoutes.root}`,
                {
                    method,
                    credentials: "include",
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json" },
                },
            );
            setIsUpdating(false);
            const resData = await response.json();
            if (response.ok) {
                toast.success(`Building Group ${data.name} created`, {
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
                <CardTitle>Create a building group</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="The Fiktional Estates Group wants to optimize the use and
maintenance of multiple buildings. We've previously searched
through disconnected folders, messages, and spreadsheets
to coordinate the information we need, but now want to
use Autodesk software & services instead.
"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button>Create Building Group</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
