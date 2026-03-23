import { handlePrismaError } from "../lib/handlePrismaError";
import { compareHash, hashPassword } from "../lib/hashPassword";
import { prisma } from "../lib/prisma";
import { ForgotPassword, ResetPassword } from "@autocoderz/shared";
import { updatePassword } from "./user";
import { Prisma } from "../generated/prisma/client";

export async function createPasswordReset(data: ForgotPassword) {
    try {
        const { email } = data;

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const codeHash = await hashPassword(code);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await prisma.$transaction([
            prisma.passwordReset.deleteMany({ where: { email } }),
            prisma.passwordReset.create({
                data: { email, codeHash, expiresAt },
            }),
        ]);

        return { code };
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function resetUserPassword(data: ResetPassword) {
    try {
        const { email, code, password } = data;

        const reset = await prisma.passwordReset.findFirst({
            where: {
                email,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!reset) {
            throw {
                error: {
                    title: "Invalid or expired code",
                    description: "",
                },
            };
        }

        const valid = await compareHash(code, reset.codeHash);
        if (!valid)
            throw {
                error: {
                    title: "Invalid code",
                    description: "",
                },
            };

        await updatePassword(email, password);

        await prisma.passwordReset.update({
            where: { id: reset.id },
            data: { used: true },
        });

        return { code };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw handlePrismaError(error);
        } else throw error;
    }
}
