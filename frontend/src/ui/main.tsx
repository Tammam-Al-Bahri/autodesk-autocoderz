import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ManagerViewProvider } from "./context/ManagerViewContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <ManagerViewProvider>
                    <App />
                    <Toaster />
                </ManagerViewProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
);
