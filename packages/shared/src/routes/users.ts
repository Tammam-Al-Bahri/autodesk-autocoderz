export const userBase = "/api/users";

export const usersRoutes = {
    getUsers: "/",
    createUser: "/",
} as const;

export type UsersRoute = (typeof usersRoutes)[keyof typeof usersRoutes];
