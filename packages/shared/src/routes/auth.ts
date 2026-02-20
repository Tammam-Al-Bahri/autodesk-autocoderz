export const authRoutes = {
    base: "/api/auth",
    login: "/login",
    logout: "/logout",
    me: "/me",
} as const;

export type AuthRoute = (typeof authRoutes)[keyof typeof authRoutes];
