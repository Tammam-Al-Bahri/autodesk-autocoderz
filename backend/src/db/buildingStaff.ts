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

export async function getBuildingStaffFromBuildingId(buildingId: BuildingId) {
    try {
        const buildlingStaff = await prisma.buildingStaff.findMany({
            where: {
                buildingId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        return buildlingStaff;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function getBuildingsWhereStaffFromUserId(userId: UserId) {
    try {
        const buildlings = await prisma.buildingStaff.findMany({
            where: {
                userId,
            },
            include: {
                building: {
                    select: {
                        name: true,
                        address: true,
                        status: true,
                        type: true,
                    },
                },
            },
        });
        return buildlings;
    } catch (error) {
        throw handlePrismaError(error);
    }
}
