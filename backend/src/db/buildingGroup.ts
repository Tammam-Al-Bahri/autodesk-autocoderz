import { CreateBuildingGroup } from "@autocoderz/shared";
import { prisma } from "../lib/prisma";
import { handlePrismaError } from "../lib/handlePrismaError";

export async function createBuildingGroup(ownerId: string, data: CreateBuildingGroup) {
    try {
        const { name, description } = data;
        const buildingGroup = await prisma.buildingGroup.create({
            data: {
                ownerId,
                name,
                description,
            },
        });
        return buildingGroup;
    } catch (error) {
        throw handlePrismaError(error);
    }
}
