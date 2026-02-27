import { handlePrismaError } from "../lib/handlePrismaError";
import { hashPassword } from "../lib/hashPassword";
import { prisma } from "../lib/prisma";
import { CreateUser, UserId } from "@autocoderz/shared";

export async function createUser(data: CreateUser) {
    try {
        const { email, password, firstName, middleName, lastName } = data;
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                middleName,
                lastName,
            },
        });
        return user;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function getUserByEmail(email: string) {
    try {
        const user = prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function getUserById(id: UserId) {
    try {
        const user = prisma.user.findUnique({ where: { id } });
        return user;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function userExists(id: UserId) {
    return !!prisma.user.findFirst({ where: { id } });
}
