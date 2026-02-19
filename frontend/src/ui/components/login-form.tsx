import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SkeletonForm } from "./skeleton-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { loginUserSchema as formSchema, type LoginUser as FormFields } from "@autocoderz/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "./ui/form";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const { login } = useAuth();
    const form = useForm<FormFields>({ resolver: zodResolver(formSchema) });

    const { handleSubmit } = form;
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            setIsUpdating(true);
            const result = await login(data.email, data.password);
            setIsUpdating(false);
            if (result.success) {
                toast.success("Logged in successfully");
                navigate("/", { replace: true });
            } else {
                toast.error("Login failed");
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
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="your@email.com"
                                                {...field}
                                            />
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Field>
                                <Button>Login</Button>
                                <FieldDescription className="text-center">
                                    Don't have an account?
                                    <Link
                                        to="/signup"
                                        className="underline underline-offset-4 hover:text-primary"
                                    >
                                        Sign up
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
