import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

export default function Test() {
    const { user, loading } = useAuth();

    console.log(user);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center h-screen">
                <Loader className="animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {user && <LogoutButton />}
            {!user && (
                <>
                    <SignupForm />
                    <LoginForm />
                </>
            )}
        </div>
    );
}
