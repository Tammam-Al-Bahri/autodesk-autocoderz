import { z } from "zod";

export const createUserSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
    firstName: z
        .string()
        .min(3, { message: "First name must be at least 3 characters" })
        .max(15, { message: "First name must be at most 15 characters" }),
    middleName: z
        .string()
        .min(3, { message: "Middle name must be at least 3 characters" })
        .max(15, { message: "First name must be at most 15 characters" })
        .nullable(),
    lastName: z
        .string()
        .min(3, { message: "Last name must be at least 3 characters" })
        .max(15, { message: "First name must be at most 15 characters" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(64, { message: "Password must be at most 64 characters" }),
});

export type CreateUser = z.infer<typeof createUserSchema>;
