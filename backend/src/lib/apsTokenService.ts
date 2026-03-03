const BASIC_AUTH = process.env.APS_BASIC_AUTH;
if (!BASIC_AUTH) throw new Error("APS_BASIC_AUTH is not defined");

type ApsToken = {
    access_token: string;
    expires_at: number; // timestamp in ms
};

type ApsTokenResponse = {
    access_token: string;
    expires_in: number;
};

let cachedToken: ApsToken | null = null;

export async function getUploadToken(): Promise<string> {
    const now = Date.now();

    if (cachedToken && cachedToken.expires_at > now + 60_000) {
        // token still valid for at least 1 minute
        return cachedToken.access_token;
    }

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append(
        "scope",
        "data:read data:write data:create bucket:create bucket:read viewables:read",
    );

    const res = await fetch("https://developer.api.autodesk.com/authentication/v2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${BASIC_AUTH}`,
        },
        body: params,
    });

    if (!res.ok) {
        throw new Error(`Autodesk auth failed: ${res.status}`);
    }

    const data = (await res.json()) as ApsTokenResponse;
    cachedToken = {
        access_token: data.access_token,
        expires_at: Date.now() + (data.expires_in - 30) * 1000, // refresh 30s early
    };

    return cachedToken.access_token;
}
