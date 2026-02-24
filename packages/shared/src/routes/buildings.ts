export const buildingsBase = "/api/buildings";

export const buildingsRoutes = {
    root: "/",
    byId: (id: string) => `/${id}`,
    rooms: (buildingId: string) => `/${buildingId}/rooms`,
};
