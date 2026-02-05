import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
    return (
        <nav className="h-16 border-b-2 flex items-center justify-between px-4">
            <div className="text-2xl">Autocoderz</div>

            <div className="flex gap-4">
                <Link to="/">Home</Link>
                <Link to="/test">Test</Link>
            </div>

            <div className="">
                <ThemeToggle />
            </div>
        </nav>
    );
}
