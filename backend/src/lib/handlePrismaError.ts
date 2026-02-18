import { Prisma } from "../generated/prisma/client";

export function handlePrismaError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            const kind =
                (error.meta?.driverAdapterError as any)?.cause?.kind || "UniqueConstraintViolation";

            const originalMessage =
                (error.meta?.driverAdapterError as any)?.cause?.originalMessage ||
                "Duplicate entry detected";

            return {
                title: kind,
                description: originalMessage,
            };
        }
    }
    return {
        title: "Database error",
        description: "An error occurred",
    };
}
