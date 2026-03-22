import { Prisma } from "../generated/prisma/client";

export function handlePrismaError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === "P2002") {
            return {
                error: {
                    title: "Duplicate value",
                    description: "A record with this value already exists.",
                },
            };
        }
    }

    return {
        error: {
            title: "Database error",
            description: "An error occurred",
        },
    };
}
