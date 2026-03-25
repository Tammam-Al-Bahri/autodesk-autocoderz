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
        dedupe: ["react", "react-dom"],
    },
    build: {
        outDir: "dist-react",
    },
    server: {
        port: 5420,
        strictPort: true,
        headers: {
            'Content-Security-Policy': `
                default-src 'self';
                script-src 'self' 'unsafe-eval';
                style-src 'self' 'unsafe-inline';
                connect-src 'self' ws: wss:;
                frame-ancestors 'none';
            `.replace(/\s{2,}/g, ' ').trim(),
            'X-Frame-Options': 'DENY'
        }
    },
});