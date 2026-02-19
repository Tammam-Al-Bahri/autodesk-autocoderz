import { z } from "zod";
import { createUserSchema } from "./user.js";

export const loginUserSchema = createUserSchema.pick({
    email: true,
    password: true,
});

export type LoginUser = z.infer<typeof loginUserSchema>;
