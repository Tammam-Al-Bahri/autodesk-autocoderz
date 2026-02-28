import { z } from "zod";

export const urn = z.base64().optional().brand<"urn">();
export type URN = z.infer<typeof urn>;
