import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { SkeletonForm } from "./skeleton-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    createUserSchema as formSchema,
    usersBase,
    usersRoutes,
    type CreateUser as FormFields,
} from "@autocoderz/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { apiFetch, apiUrl, cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "./ui/form";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Lock, UserPlus, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useManagerView } from "@/context/ManagerViewContext";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
    const form = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            middleName: "",
        },
    });

    const { handleSubmit } = form;
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const { enabled: managerViewEnabled } = useManagerView();

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setLoading(true);

        try {
            const response = await apiFetch(`${apiUrl}${usersBase}${usersRoutes.createUser}`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(`Welcome, ${data.firstName}`);

                await refreshUser();

                const savedView = localStorage.getItem("selectedView");
                if (managerViewEnabled) {
                    if (savedView === "Staff") {
                        navigate("/jobs", { replace: true });
                    } else if (savedView === "Manage") {
                        navigate("/building-groups", { replace: true });
                    } else {
                        navigate("/building-groups", { replace: true });
                    }
                } else {
                    navigate("/jobs", { replace: true });
                }
            } else if (result?.error) {
                toast.error(result.error.title, {
                    description: result.error.description,
                });
            }
        } catch (err) {
            console.log("Signup error:", err);
        }

        setLoading(false);
    };

    return (
        <div className={cn("flex flex-col gap-6 w-full max-w-lg mx-auto", className)} {...props}>
            <Card className="shadow-2xl backdrop-blur-md rounded-2xl overflow-hidden">
                <div className="h-2 w-full bg-linear-to-r from-accent to-primary" />

                <CardHeader className="space-y-1 pt-8 text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-6 h-6 text-primary" />
                    </div>

                    <CardTitle className="text-3xl font-black tracking-tight">
                        Create <span className="text-primary">Account</span>
                    </CardTitle>

                    <CardDescription className="text-muted-foreground">
                        Sign up to start using the system
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-8 pt-2">
                    {loading ? (
                        <div className="py-10 flex flex-col items-center">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />

                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                Creating account...
                            </p>

                            <SkeletonForm />
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                                                    First Name
                                                </FormLabel>

                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                                        <Input
                                                            placeholder="John"
                                                            className="pl-9 h-11 bg-input border-border"
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
                                        name="middleName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                                                    Middle
                                                </FormLabel>

                                                <FormControl>
                                                    <Input
                                                        placeholder="A."
                                                        className="h-11 bg-input border-border"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                                                    Last Name
                                                </FormLabel>

                                                <FormControl>
                                                    <Input
                                                        placeholder="Doe"
                                                        className="h-11 bg-input border-border"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                                                Email
                                            </FormLabel>

                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                                    <Input
                                                        placeholder="name@company.com"
                                                        className="pl-9 h-11 bg-input border-border"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>

                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                                                    Password
                                                </FormLabel>

                                                <FormControl>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                                        <Input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            className="pl-9 h-11 bg-input border-border"
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
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                                                    Confirm
                                                </FormLabel>

                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="h-11 bg-input border-border"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] mt-4"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Sign Up
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <div className="pt-4 text-center">
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Already have an account?{" "}
                                        <Link
                                            to="/login"
                                            className="font-bold text-accent-foreground hover:underline"
                                        >
                                            Log In
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure account connection</span>
            </div>
        </div>
    );
}
