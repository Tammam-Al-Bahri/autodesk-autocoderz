import { z } from "zod";

export const createUserSchema = z.object({
    email: z.email(),
    firstName: z.string().min(3).max(15),
    middleName: z.string().min(3).max(15).nullable(),
    lastName: z.string().min(3).max(15),
    password: z.string().min(6).max(64),
});

export type CreateUser = z.infer<typeof createUserSchema>;
