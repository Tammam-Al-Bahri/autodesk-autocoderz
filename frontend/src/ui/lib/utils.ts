import { base } from "@autocoderz/shared";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const apiUrl: string = `${import.meta.env.VITE_API_BASE_URL ?? ""}${base}`;

export const isElectron = import.meta.env.VITE_BUILD_TARGET === "electron";

export async function apiFetch(url: string, options: RequestInit = {}) {
    const sid = isElectron ? localStorage.getItem("sid") : undefined;

    const headers = {
        ...(options.headers ?? {}),
        ...(sid ? { Authorization: `Session ${sid}` } : {}),
    };

    return fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });
}

export function formatEnum(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
