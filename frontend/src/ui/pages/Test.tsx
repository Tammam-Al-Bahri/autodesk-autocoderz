import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { baseApiUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function Test() {
    const { user, loading } = useAuth();

    const onSubmit = async () => {
        try {
            const method = "GET";

            const response = await fetch(`${baseApiUrl}/api/auth/test`, {
                method: method,
                credentials: "include",
            });

            if (response.ok) {
                const json = await response.json();
                toast.success("SUCCESS MESSAGE", {
                    description: JSON.stringify(json, null, 2),
                });
            } else {
                toast.error("ERROR MESSAGE FROM API");
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center h-screen">
                <Loader className="animate-spin" />
            </div>
        );
    }

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
            <Button onClick={onSubmit}>This needs a user to be logged in</Button>
        </div>
    );
}
