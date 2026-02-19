import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { SafeUser } from "@autocoderz/shared";
import { loginUserSchema } from "@autocoderz/shared";
import { baseApiUrl } from "@/lib/utils";

interface AuthContextType {
    user: SafeUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SafeUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${baseApiUrl}/api/auth/me`, {
                method: "GET",
                credentials: "include",
            });
            if (!res.ok) {
                setUser(null);
                return null;
            }
            const data = await res.json();
            setUser(data.safeUser ?? null);
            return data.safeUser ?? null;
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
            const res = await fetch(`${baseApiUrl}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.safeUser);
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch {
            return { success: false, error: "An error occurred" };
        }
    };

    const logout = async () => {
        try {
            await fetch(`${baseApiUrl}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
