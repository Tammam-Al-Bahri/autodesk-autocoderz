import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { baseApiUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function Test() {
    const { user } = useAuth();

    const onSubmit = async () => {
        try {
            const method = "GET";

            const response = await fetch(`${baseApiUrl}/api/auth/me`, {
                method: method,
                credentials: "include",
            });

            const json = await response.json();
            if (response.ok) {
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
            <Button onClick={onSubmit}>Test</Button>
        </div>
    );
}
