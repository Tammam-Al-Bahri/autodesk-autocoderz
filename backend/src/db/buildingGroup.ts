import { BuildingGroupId, CreateBuildingGroup, UserId } from "@autocoderz/shared";
import { prisma } from "../lib/prisma";
import { handlePrismaError } from "../lib/handlePrismaError";

export async function createBuildingGroup(ownerId: UserId, data: CreateBuildingGroup) {
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

export async function getBuildingGroupsFromUserId(ownerId: UserId) {
    try {
        const buildingGroups = await prisma.buildingGroup.findMany({
            where: {
                ownerId,
            },
        });
        return buildingGroups;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function deleteBuildingGroupFromId(ownerId: UserId, id: BuildingGroupId) {
    try {
        const buildingGroup = await prisma.buildingGroup.delete({
            where: {
                id,
                ownerId,
            },
        });
        return !!buildingGroup;
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function updateBuildingGroupFromId(
    ownerId: UserId,
    buildingGroupId: BuildingGroupId,
    data: CreateBuildingGroup,
) {
    try {
        const buildingGroup = await prisma.buildingGroup.update({
            where: {
                id: buildingGroupId,
                ownerId,
            },
            data,
        });
        return buildingGroup;
    } catch (error) {
        throw handlePrismaError(error);
    }
}
