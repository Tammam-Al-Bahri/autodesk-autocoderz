export const usersRoutes = {
    base: "/api/users",
    getUsers: "/",
    createUser: "/",
} as const;

export type UsersRoute = (typeof usersRoutes)[keyof typeof usersRoutes];
