import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
import { apiUrl } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "./ui/form";
import { useAuth } from "@/context/AuthContext";

export function SignupForm() {
    const form = useForm<FormFields>({ resolver: zodResolver(formSchema) });
    const { handleSubmit } = form;
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const method = "POST";

            setIsUpdating(true);
            const response = await fetch(`${apiUrl}${usersBase}${usersRoutes.createUser}`, {
                method,
                credentials: "include",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
            setIsUpdating(false);
            const resData = await response.json();
            if (response.ok) {
                toast.success(`Welcome, ${data.firstName}`);
                await refreshUser();
                navigate("/", { replace: true });
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
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
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
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Adam" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Doe" {...field} />
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
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button>Create Account</Button>
                        {/* <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <Input id="name" type="text" placeholder="John Doe" required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                                <FieldDescription>
                                    We&apos;ll use this to contact you. We will not share your email
                                    with anyone else.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input id="password" type="password" required />
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                                <Input id="confirm-password" type="password" required />
                                <FieldDescription>Please confirm your password.</FieldDescription>
                            </Field>
                            <FieldGroup>
                                <Field>
                                    <Button type="submit">Create Account</Button>
                                    <FieldDescription className="px-6 text-center">
                                        Already have an account?
                                        <Link
                                            to="/login"
                                            className="underline underline-offset-4 hover:text-primary"
                                        >
                                            Sign in
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </FieldGroup> */}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
