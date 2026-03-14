import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { SafeUser } from "@autocoderz/shared";
import { authBase, authRoutes, loginUserSchema } from "@autocoderz/shared";
import { apiFetch, apiUrl, isElectron } from "@/lib/utils";

interface AuthContextType {
    user: SafeUser | null;
    loading: boolean;
    login: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: { title: string; description: string } }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SafeUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`${apiUrl}${authBase}${authRoutes.me}`, {
                method: "GET",
            });
            if (!res.ok) {
                setUser(null);
                return null;
            }
            const data = await res.json();
            setUser(data.user ?? null);
            return data.user ?? null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            loginUserSchema.parse({ email, password });
            const res = await apiFetch(`${apiUrl}${authBase}${authRoutes.login}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                if (isElectron) {
                    localStorage.setItem("sid", data.sid);
                }
                setUser(data.safeUser);
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch {
            return { success: false, error: { title: "An error occurred", description: "" } };
        }
    };

    const logout = async () => {
        try {
            await apiFetch(`${apiUrl}${authBase}${authRoutes.logout}`, {
                method: "POST",
                credentials: "include",
            });
            if (isElectron) {
                localStorage.removeItem("sid");
            }
        } finally {
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
