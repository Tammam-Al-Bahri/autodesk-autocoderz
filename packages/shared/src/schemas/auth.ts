import { z } from "zod";

export const emailSchema = z.email({ message: "Please enter a valid email address" });

export const forgotPasswordSchema = z.object({ email: emailSchema });
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

export const passwordSchema = z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(64, { message: "Password must be at most 64 characters" });

export const loginUserSchema = z.object({ email: emailSchema, password: passwordSchema });

export type LoginUser = z.infer<typeof loginUserSchema>;

export const resetPasswordSchema = z
    .object({
        email: emailSchema,
        code: z.string().min(6, "Code must be 6 digits"),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type ResetPassword = z.infer<typeof resetPasswordSchema>;

export const resetPasswordFormSchema = z
    .object({
        code: z.string().min(6, "Code must be 6 digits"),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;
