import { z } from "zod";
import { baseUserSchema } from "./user.js";

export const loginUserSchema = baseUserSchema.pick({
    email: true,
    password: true,
});

export type LoginUser = z.infer<typeof loginUserSchema>;
