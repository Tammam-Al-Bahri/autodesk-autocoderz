import { prisma } from "../lib/prisma";
import { handlePrismaError } from "../lib/handlePrismaError";
import { BuildingId, BuildingStaffId, CreateBuildingStaffInvite, UserId } from "@autocoderz/shared";
import { BuildingStaffInviteStatus } from "../generated/prisma/enums";
import { Prisma } from "../generated/prisma/client";

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
                        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                         // Unique constraint violation
                        if (error.code === "P2002") {
                            throw {
                          error: {
                        title: "user already invited to this building",
                       
                    },
                };
            }
        }
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

export async function getBuildingsWhereStaffFromUserId(userId: UserId, buildingId?: BuildingId) {
    try {
        const buildlingStaff = await prisma.buildingStaff.findMany({
            where: {
                userId,
                buildingId,
            },
            include: {
                building: {
                    select: {
                        buildingGroupId: true,
                        name: true,
                        address: true,
                        status: true,
                        type: true,
                    },
                },
            },
        });
        return buildlingStaff;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function updateBuildingStaffStatus(
    id: BuildingStaffId,
    status: BuildingStaffInviteStatus,
) {
    try {
        const buildlingStaff = await prisma.buildingStaff.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
        return buildlingStaff;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function deleteBuildingStaff(id: BuildingStaffId) {
    try {
        const deletedStaff = await prisma.buildingStaff.delete({
            where: {
                id,
            },
        });
        return deletedStaff;
    } catch (error) {
        throw handlePrismaError(error);
    }
}
