export const roomsBase = "/api/rooms";

export const roomsRoutes = {
    root: "/",
    byId: (id: string) => `/${id}`,
} as const;
