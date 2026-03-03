import { BuildingGroupId, BuildingId, CreateBuilding, URN } from "@autocoderz/shared";
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
