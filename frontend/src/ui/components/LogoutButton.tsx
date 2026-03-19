import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <Button
            variant="outline"
            onClick={() => {
                logout();
                navigate("/", { replace: true });
            }}
        >
            Logout
        </Button>
    );
}
