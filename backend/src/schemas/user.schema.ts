import { z } from "zod";

export const createUserSchema = z.object({
    email: z.email(),
    firstName: z.string().min(3),
    middleName: z.string().min(3).nullable(),
    lastName: z.string().min(3),
    password: z.string().min(6),
});

export type CreateUser = z.infer<typeof createUserSchema>;
