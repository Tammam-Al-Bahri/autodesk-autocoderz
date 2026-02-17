import * as bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const pepper = process.env.PEPPER;
    const salt = parseInt(process.env.SALT_ROUNDS ?? "10", 10);
    const hashedPassword = await bcrypt.hash(password + pepper, salt);
    return hashedPassword;
}