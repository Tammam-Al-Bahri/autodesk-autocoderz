import { apiFetch, apiUrl, cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { SkeletonForm } from "./skeleton-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "./ui/form";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, KeyRound, RefreshCw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
    authBase,
    authRoutes,
    forgotPasswordSchema,
    resetPasswordFormSchema,
    type ForgotPassword,
    type ResetPasswordForm,
} from "@autocoderz/shared";
import { useAuth } from "@/context/AuthContext";

export function PasswordResetForm({ className, ...props }: React.ComponentProps<"div">) {
    const navigate = useNavigate();

    const { user } = useAuth();

    const isLoggedIn = !!user?.email;

    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState<1 | 2>(isLoggedIn ? 2 : 1);
    const [email, setEmail] = useState(user?.email ?? "");

    useEffect(() => {
        if (isLoggedIn && user?.email) {
            setEmail(user.email);
            sendCode({ email: user.email });
        }
    }, [isLoggedIn, user?.email]);

    const [count, setCount] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const emailForm = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const resetForm = useForm({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: { code: "", password: "", confirmPassword: "" },
    });

    useEffect(() => {
        if (step !== 2) return;

        const interval = setInterval(() => {
            setCount((c) => {
                if (c <= 1) {
                    setCanResend(true);
                    clearInterval(interval);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [step]);

    const sendCode = async (data: ForgotPassword) => {
        setLoading(true);

        try {
            const res = await apiFetch(`${apiUrl}${authBase}${authRoutes.forgotPassword}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email }),
            });

            const json = await res.json();

            if (json?.success) {
                setEmail(data.email);
                setStep(2);
                setCount(30);
                setCanResend(false);
                toast.success("Code sent");
            } else if (json?.error) {
                toast.error(json.error.title, {
                    description: json.error.description,
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }

        setLoading(false);
    };

    const resend = async () => {
        setLoading(true);

        try {
            const res = await apiFetch(`${apiUrl}${authBase}${authRoutes.forgotPassword}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const json = await res.json();

            if (json?.success) {
                setCount(30);
                setCanResend(false);
                toast.success("Code resent");
            }
        } catch {
            toast.error("Try again");
        }

        setLoading(false);
    };

    const doReset = async (data: ResetPasswordForm) => {
        setLoading(true);

        try {
            const res = await apiFetch(`${apiUrl}${authBase}${authRoutes.resetPassword}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    code: data.code,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                }),
            });

            const json = await res.json();

            if (json?.success) {
                toast.success("Password updated");
                navigate(isLoggedIn ? "/profile" : "/login");
            } else if (json?.error) {
                toast.error(json.error.title, {
                    description: json.error.description,
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Reset failed");
        }

        setLoading(false);
    };

    return (
        <div className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)} {...props}>
            <Card className="shadow-xl rounded-2xl overflow-hidden">
                <div className="h-1.5 w-full bg-linear-to-r from-accent to-primary" />

                <CardHeader className="pt-8 text-center space-y-2">
                    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <KeyRound size={36} className="text-primary" />
                    </div>

                    <CardTitle className="text-2xl font-bold">
                        Reset <span className="text-primary">Password</span>
                    </CardTitle>

                    <CardDescription>
                        {step ? "Enter your email to receive a code" : `Code sent to ${email}`}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-8">
                    {loading ? (
                        <div className="py-10 flex flex-col items-center">
                            <Loader2 className="w-8 h-8 animate-spin mb-3" />
                            <p className="text-xs uppercase">
                                {step === 1 && !isLoggedIn ? "Sending..." : "Processing..."}
                            </p>
                            <SkeletonForm />
                        </div>
                    ) : step === 1 && !isLoggedIn ? (
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(sendCode)} className="space-y-5">
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                                    <Input
                                                        type="email"
                                                        className="pl-10 h-11"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full h-11">
                                    Send Code <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>

                                <p className="text-sm text-center text-muted-foreground">
                                    <Link to="/login" className="underline">
                                        Back to login
                                    </Link>
                                </p>
                            </form>
                        </Form>
                    ) : (
                        <Form {...resetForm}>
                            <form onSubmit={resetForm.handleSubmit(doReset)} className="space-y-5">
                                <FormField
                                    control={resetForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center space-y-2">
                                            <FormLabel>Code</FormLabel>

                                            <FormControl>
                                                <InputOTP
                                                    maxLength={6}
                                                    pattern={REGEXP_ONLY_DIGITS}
                                                    {...field}
                                                >
                                                    <InputOTPGroup className="gap-2">
                                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                                            <InputOTPSlot
                                                                key={i}
                                                                index={i}
                                                                className="h-11 w-11 border border-muted-foreground/40 bg-background rounded-md text-base text-center"
                                                            />
                                                        ))}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>

                                            <p className="text-xs text-muted-foreground">
                                                Enter the 6-digit code
                                            </p>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={resetForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                                    <Input
                                                        type="password"
                                                        className="pl-10 h-11"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={resetForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                                    <Input
                                                        type="password"
                                                        className="pl-10 h-11"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-col gap-3 pt-1">
                                    <Button type="submit" className="w-full h-11">
                                        Update Password
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resend}
                                        disabled={!canResend}
                                    >
                                        {canResend ? (
                                            <>
                                                {" "}
                                                <RefreshCw className="w-4 h-4 mr-2" /> Resend
                                                Code{" "}
                                            </>
                                        ) : (
                                            `Resend in ${count}s`
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setStep(1);
                                            resetForm.reset();
                                        }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure password recovery</span>
            </div>
        </div>
    );
}
