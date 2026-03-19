import { Prisma } from "../generated/prisma/client";

export function handlePrismaError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === "P2002") {
            const fields = error.meta?.target as string[] | undefined;

            return {
                error: {
                    title: "Duplicate value",
                    description: fields?.length
                        ? `A record with this ${fields.join(", ")} already exists.`
                        : "A record with this value already exists.",
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
