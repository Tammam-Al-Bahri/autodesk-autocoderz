export const buildingGroupsBase = "/api/building-groups";

export const buildingGroupsRoutes = {
    root: "/",
    byId: (id: string) => `/${id}`,
    buildings: (groupId: string) => `/${groupId}/buildings`,
} as const;
