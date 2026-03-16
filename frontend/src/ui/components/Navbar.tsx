import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
        if (!user) return "Guest";

        if (savedView === "Guest" || savedView === "Staff" || savedView === "Manage") {
            return savedView;
        }
        return "Staff";
    });

    useEffect(() => {
        if (!user) {
            setCurrentView("Guest");
        }
        const savedView = localStorage.getItem("selectedView");
        if (savedView === "Guest" || savedView === "Staff" || savedView === "Manage") {
            setCurrentView(savedView);
        }
    }, [user]);

    const navLinks = pagesLinks.filter((link) =>
        link.navbarView?.includes(user ? currentView : "Guest"),
    );

    const views: { title: string; value: NavbarView }[] = [
        // { title: "Guest", value: "Guest" },
        { title: "Staff", value: "Staff" },
        { title: "Manage", value: "Manage" },
    ];

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="border-b-2 relative flex items-center px-4 py-2 z-10 select-none">
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden mr-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
                <div className="border-r-2 pr-2">
                    <Logo />
                </div>
                {user ? (
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
                                    key={view.value}
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
                ) : null}
            </div>

            <div className="absolute left-1/2 top-0 hidden md:flex h-full -translate-x-1/2 items-center gap-2">
                {navLinks.map((link) => (
                    <Button key={link.path} variant={"ghost"} asChild>
                        <Link to={link.path}>{link.title}</Link>
                    </Button>
                ))}
            </div>

            <div className="flex items-center gap-4 ml-auto z-10">
                {user ? (
                    <>
                        <LogoutButton />
                    </>
                ) : (
                    <Button asChild variant="outline">
                        <Link to="/login">Login</Link>
                    </Button>
                )}
                <ThemeToggle />
            </div>

            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full border-b bg-background flex flex-col items-center gap-2 py-4 md:hidden">
                    {navLinks.map((link) => (
                        <Button
                            key={link.path}
                            variant="ghost"
                            asChild
                            className="w-full"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Link to={link.path}>{link.title}</Link>
                        </Button>
                    ))}
                </div>
            )}
        </nav>
    );
}
