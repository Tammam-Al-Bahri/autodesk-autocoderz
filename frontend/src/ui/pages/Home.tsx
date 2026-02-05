import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    return (
        <div>
            HOME
            <Button onClick={() => navigate("/test")}>Test Page</Button>
        </div>
    );
}
