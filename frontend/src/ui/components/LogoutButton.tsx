import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
    const { logout } = useAuth();
    return <Button onClick={logout}>Logout</Button>;
}
