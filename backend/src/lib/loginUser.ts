import { getUserByEmail } from "../db/user";
import * as bcrypt from "bcrypt";
import { compareHash } from "./hashPassword";

export async function loginUser(email: string, password: string) {
    const user = await getUserByEmail(email);
    if (!user) return null;

    const valid = await compareHash(password, user.passwordHash);
    if (!valid) return null;

    return user;
}
