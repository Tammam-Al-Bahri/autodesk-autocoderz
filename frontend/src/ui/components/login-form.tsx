import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SkeletonForm } from "./skeleton-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { loginUserSchema as formSchema, type LoginUser as FormFields } from "@autocoderz/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "./ui/form";
import { Mail, Lock, Building2, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useManagerView } from "@/context/ManagerViewContext";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const { login } = useAuth();
    const navigate = useNavigate();

    const form = useForm<FormFields>({
        resolver: zodResolver(formSchema),
    });

    const { enabled: managerViewEnabled } = useManagerView();

    const { handleSubmit } = form;

    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setLoading(true);

        try {
            const res = await login(data.email, data.password);

            if (res?.success) {
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
            } else if (res?.error) {
                toast.error(res.error.title, {
                    description: res.error.description,
                });
            }
        } catch (err) {
            console.log("Login error:", err);
        }

        setLoading(false);
    };

    return (
        <div className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)} {...props}>
            <Card className="shadow-2xl backdrop-blur-md rounded-2xl overflow-hidden">
                <div className="h-2 w-full bg-linear-to-r from-accent to-primary" />

                <CardHeader className="space-y-1 pt-8 text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Building2 size={50} className="text-primary" />
                    </div>

                    <CardTitle className="text-3xl font-black tracking-tight">
                        Welcome <span className="">Back</span>
                    </CardTitle>

                    <CardDescription className="text-muted-foreground">
                        Sign in to continue to the dashboard
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-8">
                    {loading ? (
                        <div className="py-10">
                            <SkeletonForm />
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">
                                                Email Address
                                            </FormLabel>

                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                                    <Input
                                                        type="email"
                                                        placeholder="name@company.com"
                                                        className="pl-10 h-12 focus:ring-2 focus:ring-popover"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="font-bold">
                                                    Password
                                                </FormLabel>

                                                <Link
                                                    to="/password-reset"
                                                    className="text-xs font-semibold text-accent-foreground hover:underline"
                                                >
                                                    Forgot?
                                                </Link>
                                            </div>

                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="pl-10 h-12"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h- font-bold text-lg shadow-lg transition-all hover:scale-101"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <div className="pt-4 text-center">
                                    <p className="text-sm text-slate-500">
                                        Don't have an account?{" "}
                                        <Link
                                            to="/signup"
                                            className="font-bold hover:underline text-accent-foreground"
                                        >
                                            Create one
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure login</span>
            </div>
        </div>
    );
}
