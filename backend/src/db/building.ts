import { BuildingGroupId, BuildingId, CreateBuilding, URN, UserId } from "@autocoderz/shared";
import { prisma } from "../lib/prisma";
import { handlePrismaError } from "../lib/handlePrismaError";

export async function createBuilding(data: CreateBuilding) {
    try {
        const { buildingGroupId, name, address, status, type } = data;
        const building = await prisma.building.create({
            data: {
                buildingGroupId,
                name,
                address,
                status,
                type,
            },
        });
        return building;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function getBuildingsFromBuildingGroupId(buildingGroupId: BuildingGroupId) {
    try {
        const buildings = await prisma.building.findMany({
            where: {
                buildingGroupId,
            },
        });
        return buildings;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function getBuildingFromId(buildingId: BuildingId) {
    try {
        const building = await prisma.building.findFirst({
            where: {
                id: buildingId,
            },
        });
        return building;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function updateBuildingUrn(buildingId: BuildingId, urn: URN) {
    try {
        const building = await prisma.building.update({
            where: {
                id: buildingId,
            },
            data: {
                urn: urn,
            },
        });
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function canManageBuildingStaff(userId: UserId, buildingId: BuildingId) {
    // if userId = building's building group's owner's userId
    // aka only company owner can invite staff to any buildings in company
    // at least for now
    try {
        const buildingGroupOwner = await prisma.building.findUnique({
            where: {
                id: buildingId,
                buildingGroup: {
                    ownerId: userId,
                },
            },
            select: {
                buildingGroup: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        });

        return !!buildingGroupOwner;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function deleteBuildingFromId(ownerId: UserId, id: BuildingId) {
    try {
        const building = await prisma.building.delete({
            where: {
                id,
                buildingGroup: {
                    ownerId,
                },
            },
        });
        return !!building;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function updateBuildingFromId(
    ownerId: UserId,
    buildingId: BuildingId,
    data: CreateBuilding,
) {
    try {
        const building = await prisma.building.update({
            where: {
                buildingGroup: {
                    ownerId,
                },
                id: buildingId,
            },
            data,
        });
        return building;
    } catch (error) {
        throw handlePrismaError(error);
    }
}
