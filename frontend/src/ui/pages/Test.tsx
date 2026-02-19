import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import LogoutButton from "@/components/LogoutButton";

export default function Test() {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
    return (
        <div>
            <LoginForm />
            <LogoutButton />
            <SignupForm />
        </div>
    );
}
