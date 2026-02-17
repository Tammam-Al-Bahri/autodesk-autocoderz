import { z } from "zod";

export const createUserSchema = z.object({
    email: z.email(),
    firstName: z.string(),
    middleName: z.string().nullable(),
    lastName: z.string(),
    password: z.string().min(6),
});

export type CreateUser = z.infer<typeof createUserSchema>;
