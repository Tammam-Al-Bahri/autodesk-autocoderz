import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    buildingsBase,
    buildingFormSchema as formSchema,
    type BuildingForm as FormFields,
    buildingGroupId as buildingGroupIdSchema,
    type CreateBuilding,
    type BuildingGroupId,
} from "@autocoderz/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { apiFetch, apiUrl, formatEnum, cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Building2, MapPin, Loader2, PlusCircle } from "lucide-react";

export function BuildingForm({
    buildingGroupId,
    className,
    ...props
}: { buildingGroupId: BuildingGroupId } & React.ComponentProps<"div">) {
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
            const response = await apiFetch(`${apiUrl}${buildingsBase}`, {
                method,
                body: JSON.stringify(fullData),
                headers: { "Content-Type": "application/json" },
            });
            setIsUpdating(false);
            const resData = await response.json();
            if (response.ok) {
                toast.success(`Building ${data.name} created`, {
                    description: JSON.stringify(resData, null, 2),
                });
                form.reset();
            } else {
                const { title, description } = resData.error;
                toast.error(title, { description });
            }
        } catch (error) {
            setIsUpdating(false);
            console.log(error);
        }
    };

    if (isUpdating) {
        return (
            <Card className="p-6 w-full border-border shadow-sm bg-card transition-colors duration-300">
                <div className="flex flex-col items-center py-6">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Registering Asset...
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className={cn("w-full", className)} {...props}>
            <Card className="border-border shadow-lg bg-card overflow-hidden rounded-xl transition-colors duration-300">
                <div className="h-1.5 w-full bg-primary" />

                <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center text-foreground">
                        <PlusCircle className="w-5 h-5 mr-2 text-primary" />
                        Create Building
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Add a new building to your company portfolio.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Fiktional Estates Group"
                                                    className="pl-9 h-11 bg-background border-input focus-visible:ring-1 focus-visible:ring-ring transition-all font-medium text-foreground placeholder:text-muted-foreground"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                                            Address
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="S10 1WB, UK"
                                                    className="pl-9 h-11 bg-background border-input focus-visible:ring-1 focus-visible:ring-ring transition-all font-medium text-foreground placeholder:text-muted-foreground"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                                                Status
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11 bg-background border-input focus-visible:ring-1 focus-visible:ring-ring transition-all font-medium text-foreground">
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
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                                                Type
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11 bg-background border-input focus-visible:ring-1 focus-visible:ring-ring transition-all font-medium text-foreground">
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
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full h-11 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] group"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    "Create Building"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
