import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: process.env.VITE_BUILD_TARGET === "electron" ? "./" : "/",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/ui"),
        },
    },
    build: {
        outDir: "dist-react",
    },
    server: {
        port: 5420,
        strictPort: true,
    },
});
