import { prisma } from "../lib/prisma";
import { handlePrismaError } from "../lib/handlePrismaError";
import { BuildingId, CreateBuildingStaffInvite, UserId } from "@autocoderz/shared";

export async function createBuildingStaffInvite(data: CreateBuildingStaffInvite) {
    try {
        const { buildingId, userId, role } = data;
        const buildlingStaff = await prisma.buildingStaff.create({
            data: {
                buildingId,
                userId,
                role,
                status: "PENDING",
            },
        });
        return buildlingStaff;
    } catch (error) {
        throw handlePrismaError(error);
    }
}
