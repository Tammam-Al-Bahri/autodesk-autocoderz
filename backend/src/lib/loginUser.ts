import { getUserByEmail } from "../db/user";
import * as bcrypt from "bcrypt";

export async function loginUser(email: string, password: string) {
    const user = await getUserByEmail(email);
    if (!user) return null;

    const pepper = process.env.PEPPER ?? "";
    const valid = await bcrypt.compare(password + pepper, user.passwordHash);
    if (!valid) return null;

    return user;
}
