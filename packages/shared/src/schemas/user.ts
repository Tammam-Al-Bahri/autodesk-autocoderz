import { z } from "zod";

export const userId = z.cuid().brand<"UserId">();
export type UserId = z.infer<typeof userId>;

const passwordSchema = z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(64, { message: "Password must be at most 64 characters" });

export const baseUserSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
    firstName: z
        .string()
        .min(3, { message: "First name must be at least 3 characters" })
        .max(15, { message: "First name must be at most 15 characters" }),
    middleName: z.string().max(15, { message: "Middle name must be at most 15 characters" }),
    lastName: z
        .string()
        .min(3, { message: "Last name must be at least 3 characters" })
        .max(15, { message: "Last name must be at most 15 characters" }),
    password: passwordSchema,
});

export type BaseUser = z.infer<typeof baseUserSchema>;

export const safeUserSchema = baseUserSchema
    .omit({
        password: true,
    })
    .extend({
        id: userId,
    });

export type SafeUser = z.infer<typeof safeUserSchema>;

export const createUserSchema = baseUserSchema
    .extend({
        confirmPassword: passwordSchema,
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords do not match",
            });
        }
    });

export type CreateUser = z.infer<typeof createUserSchema>;
