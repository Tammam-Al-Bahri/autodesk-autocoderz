import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { pagesLinks } from "@/pages";

export type NavbarView = "Guest" | "Staff" | "Manage";

export default function Navbar() {
    const { user } = useAuth();

    const [currentView, setCurrentView] = useState<NavbarView>(() => {
        const savedView = localStorage.getItem("selectedView");
        if (savedView === "Guest" || savedView === "Staff" || savedView === "Manage") {
            return savedView;
        }
        return "Guest";
    });

    const navLinks = pagesLinks.filter((link) => link.navbarView?.includes(currentView));

    const views: { title: string; value: "Guest" | "Staff" | "Manage" }[] = [
        { title: "Guest", value: "Guest" },
        { title: "Staff", value: "Staff" },
        { title: "Manage", value: "Manage" },
    ];

    return (
        <nav className="border-b-2 relative flex items-center px-4 py-2 z-10 select-none">
            <div className="flex items-center gap-4">
                <div className="border-r-2 pr-2">
                    <Logo />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="font-semibold italic flex">
                            {currentView}
                            <ChevronDown className="scale-50" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {views.map((view) => (
                            <DropdownMenuItem
                                className="justify-center"
                                onClick={() => {
                                    setCurrentView(view.value);
                                    localStorage.setItem("selectedView", view.value);
                                }}
                            >
                                {view.title}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="absolute left-1/2 top-0 flex h-full -translate-x-1/2 items-center gap-2">
                {navLinks.map((link) => (
                    <Button key={link.path} variant={"ghost"} asChild>
                        <Link to={link.path}>{link.title}</Link>
                    </Button>
                ))}
            </div>

            <div className="flex items-center gap-4 ml-auto z-10">
                {user ? (
                    <LogoutButton />
                ) : (
                    <Button asChild variant="outline">
                        <Link to="/login">Login</Link>
                    </Button>
                )}
                <ThemeToggle />
            </div>
        </nav>
    );
}
