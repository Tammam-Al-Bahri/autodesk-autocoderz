import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { baseApiUrl } from "@/lib/utils";
import { toast } from "sonner";
import { apsBase, apsRoutes, authRoutes } from "@autocoderz/shared";
import AutodeskViewer from "@/components/AutodeskViewer";
import { useState } from "react";
import { BuildingGroupForm } from "@/components/BuildingGroupForm";

export default function Test() {
    const BUILDING_URN =
        "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXV0b2NvZGVyel9wZXJtYW5lbnRfc3RvcmFnZS9Tbm93ZG9uX1Rvd2Vyc19GaW5hbC5ydnQ";

    const { user } = useAuth();
    const [autodeskToken, setAutodeskToken] = useState("");

    const onSubmit = async () => {
        try {
            const method = "GET";

            const response = await fetch(`${baseApiUrl}${apsBase}${apsRoutes.viewerToken}`, {
                method: method,
                credentials: "include",
            });

            const json = await response.json();
            if (response.ok) {
                setAutodeskToken(json.access_token);
                toast.success("SUCCESS MESSAGE", {
                    description: JSON.stringify(json, null, 2),
                });
            } else {
                toast.error("ERROR MESSAGE FROM API", {
                    description: JSON.stringify(json, null, 2),
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            {!user && (
                <>
                    <SignupForm />
                    <LoginForm />
                </>
            )}
            {user && (
                <>
                    <div>{`ID: ${user.id}`}</div>
                    <div>{`Email: ${user.email}`}</div>
                    <div>{`First Name: ${user.firstName}`}</div>
                    <div>{`Middle Name: ${user.middleName}`}</div>
                    <div>{`Last Name: ${user.lastName}`}</div>
                    <LogoutButton />
                </>
            )}
            <Button onClick={onSubmit}>Autodesk Viewer</Button>
            {autodeskToken && <AutodeskViewer urn={BUILDING_URN} token={autodeskToken} />}
            <BuildingGroupForm />
        </div>
    );
}
