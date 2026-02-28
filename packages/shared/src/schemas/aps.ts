import z from "zod";

export const urn = z.base64().optional();
export type URN = z.infer<typeof urn>;
