export const authBase = "/api/auth";

export const authRoutes = {
    login: "/login",
    logout: "/logout",
    me: "/me",
} as const;

export type AuthRoute = (typeof authRoutes)[keyof typeof authRoutes];
