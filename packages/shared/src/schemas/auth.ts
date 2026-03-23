import { z } from "zod";
import { baseUserSchema } from "./user.js";

export const emailSchema = z.email({ message: "Please enter a valid email address" });

export const passwordSchema = z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(64, { message: "Password must be at most 64 characters" });

export const loginUserSchema = z.object({ email: emailSchema, password: passwordSchema });

export type LoginUser = z.infer<typeof loginUserSchema>;
