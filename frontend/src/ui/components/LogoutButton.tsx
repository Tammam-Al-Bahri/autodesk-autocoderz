import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
    const { logout } = useAuth();
    return (
        <Button variant="outline" onClick={logout}>
            Logout
        </Button>
    );
}
