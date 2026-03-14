import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SkeletonForm } from "../skeleton-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    buildingGroupsBase,
    createBuildingGroupSchema as formSchema,
    type CreateBuildingGroup as FormFields,
} from "@autocoderz/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { apiUrl, cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../ui/form";
import { Building, AlignLeft, Loader2, ArrowRight } from "lucide-react";

export function BuildingGroupForm({ className, ...props }: React.ComponentProps<"div">) {
    const form = useForm<FormFields>({ resolver: zodResolver(formSchema) });
    const { handleSubmit } = form;
    const [isUpdating, setIsUpdating] = useState(false);

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const method = "POST";
            setIsUpdating(true);
            const response = await fetch(`${apiUrl}${buildingGroupsBase}`, {
                method,
                credentials: "include",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
            setIsUpdating(false);
            const resData = await response.json();
            if (response.ok) {
                toast.success(`Building Group ${data.name} created`, {
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
            <Card className="p-8 w-full border-border shadow-md bg-card flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Registering Portfolio...
                </p>
                <div className="w-full mt-6 opacity-50">
                    <SkeletonForm />
                </div>
            </Card>
        );
    }

    return (
        <div className={cn("w-full max-w-2xl mx-auto", className)} {...props}>
            <Card className="border-border shadow-lg bg-card overflow-hidden rounded-xl transition-colors duration-300">
                <div className="h-2 w-full bg-primary" />
                
                <CardHeader className="pt-8 pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <Building className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-black text-center text-foreground tracking-tight">
                        Initialise <span className="text-primary">Company</span>
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground text-base px-4">
                        Add a new organisation to your platform. You can configure individual properties and staff logic after creation.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-8">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                                            Organisation Name
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="e.g. Fiktional Estates Group"
                                                    className="pl-10 h-12 bg-background border-input focus-visible:ring-1 focus-visible:ring-ring transition-all font-medium text-foreground placeholder:text-muted-foreground"
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                                            Operational Mandate (Description)
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="The Fiktional Estates Group wants to optimise the use of multiple buildings..."
                                                    className="pl-10 h-12 bg-background border-input focus-visible:ring-1 focus-visible:ring-ring transition-all font-medium text-foreground placeholder:text-muted-foreground"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <Button 
                                type="submit" 
                                disabled={isUpdating}
                                className="w-full h-12 mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg transition-all hover:scale-[1.01] active:scale-[0.99] group"
                            >
                                Create Portfolio
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}