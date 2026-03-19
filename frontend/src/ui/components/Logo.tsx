import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <div className="text-lg font-bold">
            <Link to="/">
                <span className="text-accent-foreground">AUTO</span>CODERZ
            </Link>
        </div>
    );
}
