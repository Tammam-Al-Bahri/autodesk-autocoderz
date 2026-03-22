import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ManagerViewContextType = {
    enabled: boolean;
    setEnabled: (value: boolean) => void;
};

const ManagerViewContext = createContext<ManagerViewContextType | null>(null);

export function ManagerViewProvider({ children }: { children: ReactNode }) {
    const [enabled, setEnabled] = useState(() => {
        return localStorage.getItem("manager-view-enabled") === "true";
    });

    useEffect(() => {
        localStorage.setItem("manager-view-enabled", enabled ? "true" : "false");
    }, [enabled]);

    return (
        <ManagerViewContext.Provider value={{ enabled, setEnabled }}>
            {children}
        </ManagerViewContext.Provider>
    );
}

export function useManagerView() {
    const context = useContext(ManagerViewContext);
    if (!context) {
        throw new Error("useManagerView must be used within ManagerViewProvider");
    }
    return context;
}
